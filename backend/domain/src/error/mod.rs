pub mod repo;
pub mod config;
pub mod auth_session;
pub mod handler;
pub mod service;
pub mod validate;
pub mod ar;

pub mod prelude {
    pub use super::repo::*;
    pub use super::config::*;
    pub use super::auth_session::*;
    pub use super::handler::*;
    pub use super::service::prelude::*;
    pub use super::validate::*;
    pub use super::IntoApiError;
}

pub trait IntoApiError {
    fn status_code(&self) -> u16;
    fn message(&self) -> String;
    fn cause(&self) -> Option<serde_json::Value>;
}