use crate::{error::auth_session::SessionError, event::{DomainEvent, EventEnvelope, session::SessionDomainEvent}, vo::{account_id::AccountId, session::{Jti, SessionId}}};
use chrono::{DateTime, Duration, Utc};
use derive_builder::Builder;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
pub enum TokenType {
    Refresh,
    Access,
}

#[derive(Clone, Debug, Deserialize, Serialize, Builder, PartialEq, Eq)]
pub struct Token {
    #[builder(default=Jti::build())]
    pub jti: Jti,
    pub token: String,
    pub token_type: TokenType,
    pub ttl: i64,
    pub sub: AccountId,
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
        self.created_at + Duration::seconds(self.ttl) < Utc::now()
    }
}

#[derive(Clone, Debug, Deserialize, Serialize, Builder)]
pub struct AuthSession {
    pub id: SessionId,
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
    pub ver: i8,
    pub id: SessionId,
    pub account_id: AccountId,
    #[builder(default=vec![])]
    pub sessions: Vec<AuthSession>,
    #[builder(default = 3)]
    pub session_limit: u32,

    pub inbox: Vec<DomainEvent>,
}

impl UserSession {
    // 清理过期会话
    // 返回所有过期的会话
    pub fn gc(&mut self) -> Vec<AuthSession>{
        let mut expired_sessions = Vec::new();
        
        self.sessions.retain(|s| {
            if s.is_expire() {
                // 如果过期，放入已过期列表并从主列表中移除
                self.inbox.push(
                    DomainEvent::Session(
                        EventEnvelope::new(
                            SessionDomainEvent::Expired { session_id: s.id.clone(), account_id: s.account_id.clone(), }
                        )
                    )
                );
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
            self.inbox.push(
                DomainEvent::Session(
                    EventEnvelope::new(
                        SessionDomainEvent::Expired { session_id: self.sessions[0].id.clone(), account_id: self.account_id.clone() }
                    )
                )
            );
            self.sessions.remove(0);
        }
        self.sessions.push(session);
    }
    pub fn find_token(&self, token: &Token) -> Option<&AuthSession> {
        let token = token.clone();
        self.sessions.iter()
            .find(|s| s.access_token == token)
            .or(self.sessions.iter().find(|s| s.refresh_token == token))
    }
    pub fn revoke_session_by_access_token(
        &mut self,
        access_token: &Token
    ) -> Result<(), SessionError>{
        let session = self.sessions
            .iter_mut()
            .find(|s| s.access_token == access_token.clone())
            .ok_or(SessionError::SessionNotFound { id: "".to_string() })?;
        session.access_token.revoke()?;
        session.refresh_token.revoke()?;
        Ok(())
    }
    pub fn revoke_session(&mut self, session_id: &SessionId) -> Result<(), SessionError> {
        let session = self.sessions
            .iter_mut().find(|s| s.id == *session_id)
            .ok_or(SessionError::SessionNotFound { id: session_id.to_string() })?;
        session.access_token.revoke()?;
        session.refresh_token.revoke()?;
        Ok(())
    }
}
