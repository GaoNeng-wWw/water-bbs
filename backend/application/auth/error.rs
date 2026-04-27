use serde::Serialize;

use crate::{infra::error::InfraError};
use domain::prelude::*;

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
    #[error(transparent)]
    AccountDomainError(#[from] AccountDomainError),
}


impl IntoApiError for RegistoryError {
    fn status_code(&self) -> u16 {
        match self {
            RegistoryError::InfraError { .. } => 500,
            RegistoryError::AccountExists => 404,
            RegistoryError::RepositoryError(..) => 500,
            RegistoryError::PolicyError(policy_error) => policy_error.status_code(),
            RegistoryError::VerifyCodeError(verify_code_service_error) => verify_code_service_error.status_code(),
            RegistoryError::AccountDomainError(account_domain_error) => account_domain_error.status_code(),
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
            RegistoryError::AccountDomainError(account_domain_error) => account_domain_error.cause(),
        }
    }
}

#[derive(thiserror::Error, Debug, Clone, Serialize)]
pub enum AuthServiceError {
    #[error("SESSION_NOT_FOUND")]
    SessionNotFound,
    #[error(transparent)]
    RegistoryError(#[from] RegistoryError),
    #[error("POLICY_ERROR")]
    PolicyError(#[from] PolicyError),
    #[error("CAPTCHA_REQUIRE")]
    CaptchaRequire,
    #[error("CERT_INCONSISTENT")]
    CertInconsistent,
    #[error("INVITE_CODE_REQUIRE")]
    InviteCodeRequire,
    #[error("UNSUPPORTED_IDENT_TYPE")]
    UnsupportedIdentType { ident_type: String },
    #[error("CERT_NOT_FOUND")]
    CertNotFound { cert_type: String },
    #[error("IDENT_NOT_FOUND")]
    IdentNotFound { ident_type: String },
    #[error("UNVERIFIED_IDENTIFIER")]
    UnverifiedIdentifier { iden_type: String, ident_value: String },
    #[error("ACCOUNT_NOT_FOUND")]
    AccountNotFound,
    #[error(transparent)]
    RepoError(#[from] RepositoryError),
    #[error(transparent)]
    DomainError(#[from] AccountDomainError),
    #[error(transparent)]
    TokenServiceError(#[from] TokenServiceError),
    #[error(transparent)]
    SessionDomainError(#[from] SessionError),
    #[error("MFA_REQURIE")]
    MfaRequire,
    #[error("MFA_REJECT")]
    MfaReject,
    #[error("REQUIRE_ACCESS_TOKEN")]
    RequireAccessToken,
    #[error("REQUIRE_REFRESH_TOKEN")]
    RequireRefreshToken,
    #[error(transparent)]
    InfraError(#[from] InfraError),
    #[error("PASSWORD_OR_EMAIL_ERROR")]
    PasswordOrEmailError,
}

impl IntoApiError for AuthServiceError {
    fn status_code(&self) -> u16 {
        match self {
            AuthServiceError::RegistoryError(registory_error) => registory_error.status_code(),
            AuthServiceError::PolicyError(policy_error) => policy_error.status_code(),
            AuthServiceError::CaptchaRequire => 400,
            AuthServiceError::InviteCodeRequire => 400,
            AuthServiceError::UnsupportedIdentType { .. } => 400,
            AuthServiceError::AccountNotFound => 404,
            AuthServiceError::RepoError(repository_error) => repository_error.status_code(),
            AuthServiceError::DomainError(account_domain_error) => account_domain_error.status_code(),
            AuthServiceError::TokenServiceError(token_service_error) => token_service_error.status_code(),
            AuthServiceError::SessionDomainError(err) => err.status_code(),
            AuthServiceError::MfaRequire => 403,
            AuthServiceError::CertNotFound { .. } => 404,
            AuthServiceError::CertInconsistent => 403,
            AuthServiceError::InfraError(infra_error) => infra_error.status_code(),
            AuthServiceError::MfaReject => 400,
            AuthServiceError::IdentNotFound { .. } => 404,
            AuthServiceError::UnverifiedIdentifier { .. } => 400,
            AuthServiceError::SessionNotFound => 404,
            AuthServiceError::RequireAccessToken => 400,
            AuthServiceError::RequireRefreshToken => 400,
            AuthServiceError::PasswordOrEmailError => 400,
        }
    }

    fn message(&self) -> String {
        self.to_string()
    }
    
    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            AuthServiceError::CaptchaRequire => None,
            AuthServiceError::InviteCodeRequire => None,
            AuthServiceError::AccountNotFound => None,
            AuthServiceError::UnsupportedIdentType { .. } => Some(serde_json::json!(self)),
            AuthServiceError::RegistoryError(registory_error) => registory_error.cause(),
            AuthServiceError::PolicyError(policy_error) => policy_error.cause(),
            AuthServiceError::RepoError(repository_error) => repository_error.cause(),
            AuthServiceError::DomainError(account_domain_error) => account_domain_error.cause(),
            AuthServiceError::TokenServiceError(token_service_error) => token_service_error.cause(),
            AuthServiceError::SessionDomainError(err) => err.cause(),
            AuthServiceError::MfaRequire => None,
            AuthServiceError::CertNotFound { .. } => Some(serde_json::json!(self)),
            AuthServiceError::CertInconsistent => None,
            AuthServiceError::InfraError(infra_error) => infra_error.cause(),
            AuthServiceError::MfaReject => None,
            AuthServiceError::IdentNotFound { .. } => None,
            AuthServiceError::UnverifiedIdentifier { .. } => None,
            AuthServiceError::SessionNotFound => None,
            AuthServiceError::RequireAccessToken => None,
            AuthServiceError::RequireRefreshToken => None,
            AuthServiceError::PasswordOrEmailError => None,
        }
    }
}