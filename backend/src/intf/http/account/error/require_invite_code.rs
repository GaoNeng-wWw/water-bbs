use axum::http::StatusCode;

use crate::intf::http::ext::into_response::Exception;

pub struct RequireInviteCode;

impl RequireInviteCode {}

impl Exception for RequireInviteCode {
    fn status_code(&self) -> StatusCode {
        StatusCode::BAD_REQUEST
    }
    fn message(&self) -> &'static str {
        "REQUIRE_INVITE_CODE"
    }
    fn cause(&self) -> Option<serde_json::Value> {
        None
    }
}
