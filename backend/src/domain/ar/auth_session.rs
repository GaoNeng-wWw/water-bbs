use crate::domain::{error::auth_session::SessionError, vo::account_id::AccountId};
use chrono::{DateTime, Utc};
use derive_builder::Builder;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum TokenType {
    Refresh,
    Access,
}

#[derive(Clone, Debug, Deserialize, Serialize, Builder)]
pub struct Token {
    #[builder(default=uuid::Uuid::now_v7())]
    pub jti: Uuid,
    pub token: String,
    pub token_type: TokenType,
    pub expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub revoked_at: Option<DateTime<Utc>>,
}

impl Token {
    pub fn revoke(&mut self) -> Result<(), SessionError> {
        if let Some(_) = self.revoked_at {
            return Err(SessionError::AlreadyRevoked);
        }
        self.revoked_at = Some(Utc::now());
        Ok(())
    }
    pub fn is_expired(&self) -> bool {
        self.expires_at < Utc::now()
    }
}

#[derive(Clone, Debug, Deserialize, Serialize, Builder)]
pub struct AuthSession {
    pub id: Uuid,
    pub account_id: AccountId,
    pub refresh_token: Token,
    pub access_token: Token,
    pub create_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
}

impl AuthSession {
    pub fn is_expire(&self) -> bool {
        self.expires_at < Utc::now()
    }
}

#[derive(Clone, Debug, Deserialize, Serialize, Builder)]
pub struct UserSession {
    pub id: Uuid,
    pub account_id: AccountId,
    #[builder(default=vec![])]
    pub sessions: Vec<AuthSession>,
    #[builder(default = 3)]
    pub session_limit: u32,
}

impl UserSession {
    // 清理过期会话
    // 返回所有过期的会话
    pub fn gc(&mut self) -> Vec<AuthSession>{
        let mut expired_sessions = Vec::new();
        
        self.sessions.retain(|s| {
            if s.is_expire() {
                // 如果过期，放入已过期列表并从主列表中移除
                expired_sessions.push(s.clone());
                false
            } else {
                true
            }
        });
        
        expired_sessions
    }
    pub fn add_session(&mut self, session: AuthSession) {
        self.gc();
        if self.sessions.len() >= self.session_limit as usize {
            self.sessions.sort_by_key(|s| s.create_at);
            self.sessions.remove(0);
        }
        self.sessions.push(session);
    }

    pub fn revoke_session(&mut self, session_id: &Uuid) -> Result<(), SessionError> {
        let session = self.sessions
            .iter_mut().find(|s| s.id == *session_id)
            .ok_or(SessionError::SessionNotFound { id: session_id.to_string() })?;
        session.access_token.revoke()?;
        session.refresh_token.revoke()?;
        Ok(())
    }
}
