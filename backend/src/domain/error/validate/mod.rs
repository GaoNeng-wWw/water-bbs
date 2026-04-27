use crate::domain::error::{IntoApiError, validate::auth::AuthValidteError};

pub mod auth;
#[derive(Debug,thiserror::Error)]
pub enum ValidatorError {
    #[error(transparent)]
    AuthError(#[from] AuthValidteError)
}

impl IntoApiError for ValidatorError {
    fn status_code(&self) -> u16 {
        400
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            ValidatorError::AuthError(auth_validte_error) => auth_validte_error.cause(),
        }
    }
}