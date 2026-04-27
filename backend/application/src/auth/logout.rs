use std::sync::Arc;

use derive_builder::Builder;
use josekit::jwk::Jwk;
use serde::{Deserialize, Serialize};

use infra::eventbus::EventBus;
use crate::auth::error::AuthServiceError;
use domain::prelude::*;

#[derive(Clone, Debug, Deserialize, Serialize, Builder)]
pub struct LogoutRequest {
    pub token: String
}

pub async fn handler(
    req: &LogoutRequest,
    key: Arc<Jwk>,
    token_service: Arc<dyn ITokenService>,
    session_repo: Arc<dyn ISessionRepo>,
    event_bus: Arc<dyn EventBus>,
) -> Result<(), AuthServiceError>{
    let token = req.token.clone();
    let verify_res = token_service.verify_token(&token, &key)?;
    match verify_res.token_type {
        TokenType::Refresh => Err(AuthServiceError::RequireAccessToken),
        TokenType::Access => Ok(()),
    }?;
    let mut user_session = session_repo.find_session(&verify_res.sub).await?
        .ok_or_else(|| AuthServiceError::SessionNotFound)?; 
    user_session.revoke_session_by_access_token(&verify_res)?;
    let _ =event_bus.publish(
        domain::event::DomainEvent::Session(
            EventEnvelope::new(
                SessionDomainEvent::UserSessionRevoked { session_id: user_session.id, account_id: verify_res.sub }
            )
        )
    );
    Ok(())
}