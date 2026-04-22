use jose::{header::JoseHeaderBuilderError, jws::SignError};
use serde::Serialize;

use crate::domain::error::IntoApiError;

#[derive(Debug, thiserror::Error, Clone, Serialize)]
pub enum TokenServiceError {
    #[error("TOKEN_ALREADY_REVOKED")]
    TokenAlreadyRevoked,
    #[error("TOKEN_EXPIRED")]
    TokenExpired,
    #[error("INVALID_TOKEN")]
    InvalidToken,
    #[error("INVALID_SIGNATURE")]
    InvalidSignature,
    #[error("CRYPTO_BACKEND_ERROR")]
    CryptoBackend,
    #[error("HEADER_COUNT_MISMATCH_ERROR")]
    HeaderCountMismatch,
    #[error("SERIALIZE_HEADER_ERROR")]
    SerializeHeader{ cause: String },
    #[error("EMPTY_PROTECTED_HEADER")]
    EmptyProtectedHeader,
    #[error("INVALID_HEADER")]
    InvalidHeader{ cause: String },
    #[error("SIGN_FAIL")]
    Sign { cause: String },
    #[error("REQUIRE_SIGN_KEY")]
    RequireSignKey,
    #[error("REQUIRE_VERIFY_KEY")]
    RequireVerifyKey,
    #[error("INVALID_KEY")]
    InvalidKey,
    #[error("DESERIALIZE_FAIL")]
    DeserializeFail { cause: String }
}

impl IntoApiError for TokenServiceError {
    fn status_code(&self) -> u16 {
        401
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        None
    }
}