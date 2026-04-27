use serde::Serialize;
use thiserror::Error;

use crate::error::IntoApiError;

#[derive(Debug, Error, Clone, Serialize)]
pub enum SessionError {
    #[error("SESSION_NOT_FOUND")]
    SessionNotFound { id: String },
    #[error("TOKEN_ALREADY_REVOKED")]
    AlreadyRevoked,
    #[error("INVALID_TOKEN")]
    InvalidToken,
    #[error("SESSION_LIMIT_REACHED")]
    SessionLimitReached,
}

impl IntoApiError for SessionError {
    fn status_code(&self) -> u16 {
        match self {
            SessionError::SessionNotFound { .. } => 400,
            SessionError::AlreadyRevoked => 400,
            SessionError::InvalidToken => 400,
            SessionError::SessionLimitReached => 400,
        }
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        None
    }
}