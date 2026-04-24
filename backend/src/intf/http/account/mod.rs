use axum::{Router, routing::{Route, delete, post}};

use crate::intf::http::ext::state::AppState;

pub mod handlers;
pub mod error;

pub fn route() -> Router<AppState> {
    Router::new()
        .route("/", post(handlers::login::handler))
        .route("/register", post(handlers::register::handler))
        .route("/logout", delete(handlers::logout::handler))
}