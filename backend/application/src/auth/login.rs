use std::{collections::HashMap, sync::Arc};

use chrono::{Duration, Utc};

use infra::eventbus::EventBus;
use domain::prelude::*;

use crate::auth::error::AuthServiceError;

#[derive(Clone, Debug)]
pub struct LoginRequest {
    pub ident_type:String,
    pub ident_value:String,
    pub cert_type:String,
    pub cert_value:String,
}

#[derive(Clone, Debug)]
pub struct LoginResponse {
    pub access_token: String,
    pub refresh_token: String,
}

pub async fn handler(
    req: &LoginRequest,
    repo: Arc<dyn IAccountRepo + Send + Sync>,
    token_service: Arc<dyn ITokenService + Send + Sync>,
    session_repo: Arc<dyn ISessionRepo + Send + Sync>,
    event_bus: Arc<dyn EventBus + Send + Sync>,
    key: Arc<josekit::jwk::Jwk>,
) -> Result<LoginResponse, AuthServiceError> {
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
    if account.check_cert(req.cert_type.as_str(), &req.cert_value).is_err() {
        return Err(AuthServiceError::PasswordOrEmailError)
    }
    let account_id = account.id;
    let at = token_service.issue_token(
        &IssueTokenRequest {
            sub: account_id.clone(),
            token_type: TokenType::Access,
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
            token_type: TokenType::Refresh,
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
                inbox: vec![],
            }
        );
    let events = &user_session.inbox;
    for event in events {
        let _ = event_bus.publish(event.clone());
    }
    user_session.add_session(session);
    session_repo.upsert(&user_session).await?;
    Ok(LoginResponse {
        access_token: at.token,
        refresh_token: rt.token,
    })
}