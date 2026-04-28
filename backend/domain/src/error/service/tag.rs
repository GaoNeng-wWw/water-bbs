use crate::{error::IntoApiError, prelude::RepositoryError};

#[derive(Debug, thiserror::Error, Clone)]
pub enum TagServiceError {
    #[error("TAG_NOT_FOUND")]
    TagNotFound,
    #[error(transparent)]
    RepoError(#[from] RepositoryError)
}

impl IntoApiError for TagServiceError {
    fn status_code(&self) -> u16 {
        match self {
            TagServiceError::TagNotFound => 404,
            _ => 500
        }
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            TagServiceError::TagNotFound => None,
            TagServiceError::RepoError(repository_error) => repository_error.cause(),
        }
    }
}
