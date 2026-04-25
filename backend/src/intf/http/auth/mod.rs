use axum::{Router, routing::{delete, post}};
use crate::intf::http::ext::state::AppState;
pub mod handlers;

pub fn route() -> Router<AppState> {
    Router::new()
        .route("/", post(handlers::login::handler))
        .route("/register", post(handlers::register::handler))
        .route("/logout", delete(handlers::logout::handler))
        .route("/code", post(handlers::send_mail_code::handler))
}