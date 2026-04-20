use axum::http::StatusCode;
use serde::{Deserialize, Serialize};

use crate::intf::http::ext::into_response::Exception;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct UnsupportedIdentType {}

impl UnsupportedIdentType {
    pub fn new() -> Self {
        Self {}
    }
}
impl Exception for UnsupportedIdentType {
    fn status_code(&self) -> axum::http::StatusCode {
        StatusCode::BAD_REQUEST
    }

    fn message(&self) -> &'static str {
        "UNSUPPORTED_IDENT_TYPE"
    }

    fn cause(&self) -> Option<serde_json::Value> {
        Some(serde_json::json!(self))
    }
}
