use axum::Router;

use crate::intf::http::ext::state::AppState;

pub mod handlers;
pub mod errors;

#[tracing::instrument(name = "account", skip_all)]
pub fn route() -> Router<AppState> {
    todo!()
}
