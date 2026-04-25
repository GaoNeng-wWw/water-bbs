use axum::http::StatusCode;
use serde::{Deserialize, Serialize};

use crate::intf::http::ext::into_response::Exception;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AccountAlreadyDeactivated {}

impl AccountAlreadyDeactivated {
    pub fn new() -> Self {
        Self {}
    }
}

impl Exception for AccountAlreadyDeactivated {
    fn status_code(&self) -> axum::http::StatusCode {
        StatusCode::BAD_REQUEST
    }

    fn message(&self) -> &'static str {
        "ACCOUNT_ALREADY_DEACTIVATED"
    }

    fn cause(&self) -> Option<serde_json::Value> {
        Some(serde_json::json!(self))
    }
}
