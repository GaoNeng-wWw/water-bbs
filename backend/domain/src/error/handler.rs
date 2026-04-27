use crate::{ar::account::AccountDomainError, error::{IntoApiError, repo::RepositoryError}};

#[derive(thiserror::Error, Debug)]
pub enum HandlerError {
    #[error(transparent)]
    AccountDomainError(#[from] AccountDomainError),
    #[error("INFRA_ERROR")]
    InfraError {cause: String},
    #[error(transparent)]
    RepositoryError(#[from] RepositoryError)
}

impl IntoApiError for HandlerError {
    fn status_code(&self) -> u16 {
        match self {
            HandlerError::InfraError { cause } => 500,
            _ => self.status_code()
        }
    }

    fn message(&self) -> String {
        match self {
            HandlerError::InfraError { cause } => todo!(),
            _ => self.message()
        }
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            HandlerError::InfraError { cause } => None,
            _ => self.cause()
        }
    }
}