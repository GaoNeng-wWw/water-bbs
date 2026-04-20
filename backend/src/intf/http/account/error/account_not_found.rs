use axum::http::StatusCode;
use serde::{Deserialize, Serialize};

use crate::intf::http::ext::into_response::Exception;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AccountNotFound {}

impl AccountNotFound {
    pub fn new() -> Self {
        Self {}
    }
}

impl Exception for AccountNotFound {
    fn status_code(&self) -> axum::http::StatusCode {
        StatusCode::NOT_FOUND
    }

    fn message(&self) -> &'static str {
        "ACCOUNT_NOT_FOUND"
    }

    fn cause(&self) -> Option<serde_json::Value> {
        Some(serde_json::json!(self))
    }
}