use serde::Serialize;

use crate::domain::{ar::account::AccountDomainError, error::{IntoApiError, config::PolicyError, repo::RepositoryError}, service::verify_code::VerifyCodeServiceError};

#[derive(thiserror::Error, Debug, Clone, Serialize)]
pub enum RegistoryError {
    #[error("INFRA_ERROR")]
    InfraError { cause: String },
    #[error("ACCOUNT_EXISTS")]
    AccountExists,
    #[error(transparent)]
    RepositoryError(#[from] RepositoryError),
    #[error(transparent)]
    PolicyError(#[from] PolicyError),
    #[error(transparent)]
    VerifyCodeError(#[from] VerifyCodeServiceError),
}


impl IntoApiError for RegistoryError {
    fn status_code(&self) -> u16 {
        match self {
            RegistoryError::InfraError { .. } => 500,
            RegistoryError::AccountExists => 404,
            RegistoryError::RepositoryError(..) => 500,
            RegistoryError::PolicyError(policy_error) => policy_error.status_code(),
            RegistoryError::VerifyCodeError(verify_code_service_error) => verify_code_service_error.status_code(),
        }
    }
    fn message(&self) -> String {
        self.to_string()
    }
    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            RegistoryError::InfraError { cause } => Some(serde_json::json!(cause)),
            RegistoryError::AccountExists => None,
            RegistoryError::RepositoryError(repository_error) => repository_error.cause(),
            RegistoryError::PolicyError(policy_error) => policy_error.cause(),
            RegistoryError::VerifyCodeError(verify_code_service_error) => verify_code_service_error.cause(),
        }
    }
}

#[derive(thiserror::Error, Debug, Clone, Serialize)]
pub enum AccountServiceError {
    #[error(transparent)]
    RegistoryError(#[from] RegistoryError),
    #[error("POLICY_ERROR")]
    PolicyError(#[from] PolicyError),
    #[error("CAPTCHA_REQUIRE")]
    CaptchaRequire,
    #[error("INVITE_CODE_REQUIRE")]
    InviteCodeRequire,
    #[error("UNSUPPORTED_IDENT_TYPE")]
    UnsupportedIdentType { ident_type: String },
    #[error("ACCOUNT_NOT_FOUND")]
    AccountNotFound,
    #[error(transparent)]
    RepoError(#[from] RepositoryError),
    #[error(transparent)]
    DomainError(#[from] AccountDomainError),
}

impl IntoApiError for AccountServiceError {
    fn status_code(&self) -> u16 {
        match self {
            AccountServiceError::RegistoryError(registory_error) => registory_error.status_code(),
            AccountServiceError::PolicyError(policy_error) => policy_error.status_code(),
            AccountServiceError::CaptchaRequire => 400,
            AccountServiceError::InviteCodeRequire => 400,
            AccountServiceError::UnsupportedIdentType { .. } => 400,
            AccountServiceError::AccountNotFound => 404,
            AccountServiceError::RepoError(repository_error) => repository_error.status_code(),
            AccountServiceError::DomainError(account_domain_error) => account_domain_error.status_code(),
        }
    }

    fn message(&self) -> String {
        self.to_string()
    }
    
    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            AccountServiceError::CaptchaRequire => None,
            AccountServiceError::InviteCodeRequire => None,
            AccountServiceError::AccountNotFound => None,
            AccountServiceError::UnsupportedIdentType { .. } => Some(serde_json::json!(self)),
            AccountServiceError::RegistoryError(registory_error) => registory_error.cause(),
            AccountServiceError::PolicyError(policy_error) => policy_error.cause(),
            AccountServiceError::RepoError(repository_error) => repository_error.cause(),
            AccountServiceError::DomainError(account_domain_error) => account_domain_error.cause(),
        }
    }
}