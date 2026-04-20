use serde::{Deserialize, Serialize};

use crate::domain::error::IntoApiError;

#[derive(thiserror::Error, Debug, Clone, Deserialize, Serialize)]
pub enum RepositoryError {
    #[error("DATABASE_ERROR")]
    DatabaseError { reason: String  },
    #[error("CONNECTION_ERROR")]
    ConnectionError,
    #[error("TRANSACTION_ERROR")]
    TransactionError,
    #[error("ENTITY_NOT_FOUND")]
    EntityNotFound,
    #[error("REDIS_ERROR")]
    RedisError { reason: String },
    #[error("THREAD_ERROR")]
    ThreadError { reason: String },
}

impl IntoApiError for RepositoryError {
    fn status_code(&self) -> u16 {
        500
    }
    fn message(&self) -> String {
        self.to_string()
    }
    
    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            RepositoryError::DatabaseError { .. } => Some(serde_json::json!(self)),
            RepositoryError::ConnectionError => None,
            RepositoryError::TransactionError => None,
            RepositoryError::EntityNotFound => None,
            RepositoryError::RedisError { .. } => Some(serde_json::json!(self)),
            RepositoryError::ThreadError { .. } => Some(serde_json::json!(self)),
        }
    }
}