use serde::Serialize;

use crate::error::IntoApiError;

#[derive(Debug, thiserror::Error, Serialize, Clone)]
pub enum ProfileQueryError {
    #[error("QUERY_ERROR")]
    ProfileNotFound
}

impl IntoApiError for ProfileQueryError {
    fn status_code(&self) -> u16 {
        match self {
            ProfileQueryError::ProfileNotFound => 404,
        }
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            ProfileQueryError::ProfileNotFound => None,
        }
    }
}