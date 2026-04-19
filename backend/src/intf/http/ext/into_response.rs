use axum::{Json, http::StatusCode, response::IntoResponse};

use crate::domain::error::repo::RepositoryError;

pub trait Exception {
    fn status_code(&self) -> StatusCode;
    fn message(&self) -> &'static str;
    fn cause(&self) -> Option<serde_json::Value>;
}

pub struct AppError(pub Box<dyn Exception + Send + Sync>);
pub type AppResult<T> = Result<T, AppError>;

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

// 定义一个专门的内部错误类型
pub struct InternalException(pub Option<serde_json::Value>);

// impl std::fmt::Display for InternalException { fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result { write!(f, "Internal Error") } }
impl Exception for InternalException {
    fn status_code(&self) -> StatusCode { StatusCode::INTERNAL_SERVER_ERROR }
    fn message(&self) -> &'static str { "INTERNAL_ERROR" }
    fn cause(&self) -> Option<serde_json::Value> { None }
}

#[macro_export]
macro_rules! app_err {
    ($e:expr) => { AppError(Box::new($e)) };
}