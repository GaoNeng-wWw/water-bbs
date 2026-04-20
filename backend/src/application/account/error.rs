use crate::domain::error::repo::RepositoryError;

#[derive(thiserror::Error, Debug, Clone)]
pub enum RegistoryError {
    #[error("INFRA_ERROR")]
    InfraError { cause: String },
    #[error("ACCOUNT_EXISTS")]
    AccountExists,
    #[error(transparent)]
    RepositoryError(#[from] RepositoryError)
}
#[derive(thiserror::Error, Debug, Clone)]
pub enum AccountServiceError {}