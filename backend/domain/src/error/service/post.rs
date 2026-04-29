use serde::Serialize;

use crate::{error::IntoApiError, prelude::{RepositoryError, query::error::QueryError}};

#[derive(Debug, thiserror::Error, Clone, Serialize)]
pub enum PostServiceError {
    #[error(transparent)]
    RepoError(#[from] RepositoryError),
    #[error(transparent)]
    QueryError(#[from] QueryError),
    #[error("POST_NOT_FOUND")]
    PostNotFound,
}

impl IntoApiError for PostServiceError {
    fn status_code(&self) -> u16 {
        match self {
            PostServiceError::RepoError(_) => 500,
            PostServiceError::QueryError(_) => self.status_code(),
            PostServiceError::PostNotFound => 404,
        }
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            PostServiceError::RepoError(repository_error) => repository_error.cause(),
            PostServiceError::QueryError(query_error) => query_error.cause(),
            PostServiceError::PostNotFound => None,
        }
    }
}
