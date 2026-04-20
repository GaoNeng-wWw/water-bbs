pub mod repo;
pub mod config;

pub trait IntoApiError {
    fn status_code(&self) -> u16;
    fn message(&self) -> String;
    fn cause(&self) -> Option<serde_json::Value>;
}