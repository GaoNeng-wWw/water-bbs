use serde::Serialize;
use thiserror::Error;

use crate::{error::IntoApiError, prelude::query::profile::ProfileQueryError};

#[derive(Debug, Error, Serialize, Clone)]
pub enum QueryError {
    #[error("DATABASE_ERROR")]
    DatabaseError { cause: String },
    #[error(transparent)]
    ProfileQueryError(#[from] ProfileQueryError),
}

impl IntoApiError for QueryError {
    fn status_code(&self) -> u16 {
        match self {
            QueryError::DatabaseError { .. } => 500,
            _ => self.status_code(),
        }
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            QueryError::DatabaseError { cause } => Some(serde_json::json!(self)),
            QueryError::ProfileQueryError(err) => err.cause(),
        }
    }
}