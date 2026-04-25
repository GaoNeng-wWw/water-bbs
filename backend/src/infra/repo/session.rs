use std::collections::HashMap;

use chrono::{DateTime, Utc};
use derive_builder::Builder;
use fred::{error::Error, prelude::{HashesInterface, KeysInterface, Pool, TransactionInterface}, types::Map};
use uuid::Uuid;

use crate::domain::{ar::auth_session::{AuthSession, UserSession, UserSessionBuilder}, error::repo::RepositoryError, repo::session::ISessionRepo, vo::{account_id::AccountId, session::SessionId}};

#[derive(Clone,Debug,Builder)]
pub struct SessionRepo {
    pub db: Pool
}

impl SessionRepo {
    pub fn new(db: Pool) -> Self {
        Self { db }
    }
}

fn user_session_list(account_id: &AccountId) -> String {
    format!("user_session:list:{}", account_id.to_string())
}

fn user_session_metadata(account_id: &AccountId) -> String {
    format!("user_session:metadata:{}", account_id.to_string())
}

#[async_trait::async_trait]
impl ISessionRepo for SessionRepo {
    async fn upsert(&self, session: &UserSession) -> Result<SessionId, RepositoryError>{
        let key = user_session_list(&session.account_id);
        let mut map = Map::new();
        let mut metadata = Map::new();

        metadata.insert("ver".into(), session.ver.into());
        metadata.insert("id".into(), session.id.to_string().into());
        metadata.insert("session_limit".into(), session.session_limit.into());

        let mut exp_at: HashMap<SessionId, DateTime<Utc>> = HashMap::new();
        let pipeline = self.db.multi();

        for session in &session.sessions {
            map.insert(
                session.id.clone().to_string().into(),
                serde_json::to_string(&session).unwrap().into(),
            );
            exp_at.insert(session.id.clone(), session.expires_at);
        }
        
        let _:() = pipeline.hset(&key, map).await.map_err(error_mapper)?;
        let _:() = pipeline.hset(&user_session_metadata(&session.account_id), metadata).await.map_err(error_mapper)?;
        for (id, exp) in exp_at {
            let _:() = pipeline.hexpire_at(
                &key,
                exp.timestamp(),
                None,
                vec![id.to_string()]
            ).await.map_err(error_mapper)?;
        }
        let _:() = pipeline.exec(false).await.map_err(error_mapper)?;
        Ok(session.id.clone())
    }
    async fn revoke_user_session(&self, account_id: &AccountId) -> Result<(), RepositoryError> {
        let key = user_session_list(account_id);
        let _:() = self.db.del(key).await.map_err(error_mapper)?;
        Ok(())
    }
    async fn revoke(&self, account_id: &AccountId, session_id: &SessionId) -> Result<Option<AuthSession>, RepositoryError>{
        let key = user_session_list(account_id);

        let session_str:Option<String> = self.db.hget(&key, session_id.to_string()).await.map_err(error_mapper)?;
        if let Some(session_str) = session_str {
            let session:AuthSession = serde_json::from_str(&session_str).map_err(|err| {
                RepositoryError::DeserializeError { reason: err.to_string() }
            })?;
            let _:() = self.db.hdel(key, session_id.to_string())
                .await
                .map_err(error_mapper)?;
            return Ok(Some(session));
        }
        Ok(None)
    }
    async fn find_session(&self, account_id: &AccountId) -> Result<Option<UserSession>, RepositoryError>{
        let key = user_session_list(account_id);
        let metadata_key = user_session_metadata(account_id);

        if !self.db.exists(&metadata_key).await.map_err(error_mapper)? {
            return Ok(None)
        }

        let map: HashMap<String, String> = self.db.hgetall(&key)
            .await
            .map_err(|err| {
                RepositoryError::RedisError { reason: err.to_string() }
            })?;
        let mut sessions: Vec<AuthSession> = Vec::new();
        for (_, session_str) in map {
            let session:AuthSession = serde_json::from_str(&session_str).map_err(|err| {
                RepositoryError::DeserializeError { reason: err.to_string() }
            })?;
            sessions.push(session);
        }

        let ver:i8 = self.db.hget(&metadata_key, "ver").await.map_err(error_mapper)?;
        let session_id_raw:String = self.db.hget(&metadata_key, "id").await.map_err(error_mapper)?;
        let session_id: SessionId = SessionId::new(
            Uuid::parse_str(session_id_raw.as_ref())
            .map_err(|err| {
                RepositoryError::DeserializeError { reason: err.to_string() }
            })?
        );
        let session_limit:u32 = self.db.hget(&metadata_key, "session_limit").await.map_err(error_mapper)?;

        let user_session = UserSessionBuilder::default()
            .ver(ver)
            .id(session_id)
            .account_id(account_id.clone())
            .sessions(sessions)
            .session_limit(session_limit)
            .build()
            .unwrap();

        
        Ok(Some(user_session))
    }
}

fn error_mapper(err: Error) -> RepositoryError {
    return RepositoryError::DatabaseError { reason: err.to_string() }
}
