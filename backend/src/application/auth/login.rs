use std::{collections::HashMap, sync::Arc};

use chrono::{Duration, Utc};
use jose::JsonWebKey;

use crate::{application::auth::error::AuthServiceError, domain::{ar::{account::Identity, auth_session::{AuthSessionBuilder, UserSession}}, repo::{account::IAccountRepo, session::ISessionRepo}, service::token::{ITokenService, IssueTokenRequest}, vo::session::SessionId}};

#[derive(Clone, Debug)]
pub struct LoginRequest {
    pub ident_type:String,
    pub ident_value:String,
    pub cert_type:String,
    pub cert_value:String,
}

#[derive(Clone, Debug)]
pub struct LoginResposne {
    pub access_token: String,
    pub refresh_token: String,
}

pub async fn handler(
    req: &LoginRequest,
    repo: Arc<dyn IAccountRepo>,
    token_service: Arc<dyn ITokenService>,
    session_repo: Arc<dyn ISessionRepo>,
    key: Arc<JsonWebKey>
) -> Result<LoginResposne, AuthServiceError> {
    let account = repo.find_account_id_by_ident(
        &Identity {
            id: uuid::Uuid::now_v7(),
            ident_type: req.ident_type.clone(),
            ident_value: req.ident_value.clone(),
            ident_verified: true,
        }
    )
    .await
    .map_err(|err| {
        AuthServiceError::RepoError(err)
    })?;
    if account.is_none() {
        return Err(AuthServiceError::AccountNotFound)
    }
    let account_id = account.unwrap();
    let account = repo.get_account(&account_id).await
        .map_err(|err| {
        AuthServiceError::RepoError(err)
    })?;
    if account.is_none() {
        return Err(AuthServiceError::AccountNotFound)
    }
    let account = account.unwrap();
    let account_id = account.id;
    let at = token_service.issue_token(
        &IssueTokenRequest {
            sub: account_id.clone(),
            token_type: crate::domain::ar::auth_session::TokenType::Access,
            ttl: Duration::hours(1).num_seconds(),
            issuer: "water-bbs".to_string(),
            meta: HashMap::new(),
        },
        &key
    )?;
    let mut rt_meta = HashMap::new();
    rt_meta.insert("at_id".to_string(), at.jti.to_string());
    let rt = token_service.issue_token(
        &IssueTokenRequest {
            sub: account_id.clone(),
            token_type: crate::domain::ar::auth_session::TokenType::Refresh,
            ttl: Duration::days(7).num_seconds(),
            issuer: "water-bbs".to_string(),
            meta: rt_meta,
        },
        &key
    )?;
    let now = Utc::now();
    let expire_at = now + Duration::seconds(rt.ttl);
    let session = AuthSessionBuilder::default()
        .id(SessionId::build())
        .account_id(account_id.clone())
        .access_token(at.clone())
        .refresh_token(rt.clone())
        .create_at(now)
        .expires_at(expire_at)
        .build().unwrap();
    let mut user_session = session_repo.find_session(
        &account_id
    ).await?
        .unwrap_or(
            UserSession {
                ver: 1,
                id: SessionId::build(),
                account_id,
                sessions: vec![],
                // 读取一下 features, 但这里先写死
                session_limit: 3,
            }
        );
    user_session.add_session(session);
    session_repo.upsert(&user_session).await?;
    Ok(LoginResposne {
        access_token: at.token,
        refresh_token: rt.token,
    })
    
}