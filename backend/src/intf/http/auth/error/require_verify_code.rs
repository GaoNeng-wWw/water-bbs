use axum::http::StatusCode;

use crate::intf::http::ext::into_response::Exception;

pub struct RequireVerifyCode;

impl RequireVerifyCode {} 

impl Exception for RequireVerifyCode {
    fn status_code(&self) -> StatusCode {
        StatusCode::BAD_REQUEST
    }
    fn message(&self) -> &'static str {
        "REQUIRE_VERIFY_CODE"
    }
    fn cause(&self) -> Option<serde_json::Value> {
        None
    }
}
