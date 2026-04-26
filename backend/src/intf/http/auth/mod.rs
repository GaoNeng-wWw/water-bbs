use crate::intf::http::ext::state::AppState;
use axum::{
    Router,
    routing::{delete, post},
};
pub mod handlers;
pub mod errors;

#[tracing::instrument(name = "auth", skip_all)]
pub fn route() -> Router<AppState> {
    Router::new()
        .route("/", post(handlers::login::handler))
        .route("/register", post(handlers::register::handler))
        .route("/logout", delete(handlers::logout::handler))
        .route("/code", post(handlers::send_mail_code::handler))
}

