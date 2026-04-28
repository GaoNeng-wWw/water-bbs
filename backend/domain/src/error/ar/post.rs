use serde::Serialize;
use thiserror::Error;

use crate::{error::IntoApiError, prelude::PostId};

#[derive(Debug, Clone, Error, Serialize)]
pub enum PostAggregateError {
    #[error("POST_NOT_FOUND")]
    PostNotFound { id: PostId },
}

impl IntoApiError for PostAggregateError {
    fn status_code(&self) -> u16 {
        400
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            PostAggregateError::PostNotFound { .. } => Some(serde_json::json!(self)),
        }
    }
}