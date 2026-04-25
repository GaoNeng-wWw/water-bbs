use axum::http::StatusCode;
use serde::{Deserialize, Serialize};

use crate::intf::http::ext::into_response::Exception;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AccountAlreadyExists {
    pub identifier: String,
    pub identifier_type: String,
}

impl AccountAlreadyExists {
    pub fn new(identifier: String, identifier_type: String) -> Self {
        Self { identifier, identifier_type }
    }
}

impl Exception for AccountAlreadyExists {
    fn status_code(&self) -> axum::http::StatusCode {
        StatusCode::BAD_REQUEST
    }

    fn message(&self) -> &'static str {
        "ACCOUNT_ALREADY_EXISTS"
    }

    fn cause(&self) -> Option<serde_json::Value> {
        Some(serde_json::json!(self))
    }
}