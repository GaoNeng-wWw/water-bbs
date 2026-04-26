use crate::intf::http::ext::into_response::Exception;

#[derive(Clone, Debug)]
pub struct AccuontNotFound {}
impl Exception for AccuontNotFound {
    fn status_code(&self) -> axum::http::StatusCode {
        axum::http::StatusCode::NOT_FOUND
    }

    fn message(&self) -> &str {
        "ACCOUNT_NOT_FOUND"
    }

    fn cause(&self) -> Option<serde_json::Value> {
        None
    }
}