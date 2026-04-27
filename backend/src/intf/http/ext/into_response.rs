use axum::{Json, http::StatusCode, response::IntoResponse};

use crate::domain::error::repo::RepositoryError;

pub trait Exception {
    fn status_code(&self) -> StatusCode;
    fn message(&self) -> &str;
    fn cause(&self) -> Option<serde_json::Value>;
}

pub struct AppError(pub Box<dyn Exception + Send + Sync>);
pub type AppResult<T> = Result<Json<T>, AppError>;

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let e = self.0;
        let status = e.status_code();
        
        let cause = if status.is_server_error() {
            None
        } else {
            e.cause()
        };
        
        (
            status,
            Json(
                serde_json::json!({
                    "message": e.message(),
                    "details": cause
                })
            )
        ).into_response()
    }
}

impl From<RepositoryError> for AppError {
    fn from(err: RepositoryError) -> Self {
        // 直接返回一个代表 500 的 Exception 对象
        Self(Box::new(InternalException(None)))
    }
}

pub struct InternalException(pub Option<serde_json::Value>);
impl Exception for InternalException {
    fn status_code(&self) -> StatusCode { StatusCode::INTERNAL_SERVER_ERROR }
    fn message(&self) -> &'static str { "INTERNAL_ERROR" }
    fn cause(&self) -> Option<serde_json::Value> { None }
}

pub struct BadRequestException(pub Option<serde_json::Value>);
impl Exception for BadRequestException {
    fn status_code(&self) -> StatusCode { StatusCode::BAD_REQUEST }
    fn message(&self) -> &'static str { "BAD_REQUEST" }
    fn cause(&self) -> Option<serde_json::Value> { None }
}

pub struct HttpException(pub u16, pub String, pub Option<serde_json::Value>);

impl Exception for HttpException {
    fn status_code(&self) -> StatusCode {
        StatusCode::from_u16(self.0).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
    }

    fn message(&self) -> &str {
        &self.1
    }

    fn cause(&self) -> Option<serde_json::Value> {
        self.2.clone()
    }
}

impl From<HttpException> for AppError {
    fn from(value: HttpException) -> Self {
        Self(Box::new(value))
    }
}


#[macro_export]
macro_rules! app_err {
    ($e:expr) => { crate::intf::http::ext::into_response::AppError(Box::new($e)) };
}

#[macro_export]
macro_rules! http_exception {
    ($status:expr,$e:expr) => { crate::intf::http::ext::into_response::HttpException($status, $e, None) };
    ($status:expr,$e:expr,$cause:expr) => { crate::intf::http::ext::into_response::HttpException($status, $e, $cause) };
}
