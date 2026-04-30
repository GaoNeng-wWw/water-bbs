use axum::{Router, routing::{delete, get, patch}};

use crate::intf::http::ext::state::AppState;

pub mod handlers;

pub fn route() -> Router<AppState> {
    Router::new()
        .route("/list", get(handlers::list_post::handler))
        .route("/{id}", delete(handlers::remove_post::handle))
        .route("/{id}", patch(handlers::update_post::handle))
}