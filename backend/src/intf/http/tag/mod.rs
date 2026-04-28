use crate::intf::http::ext::state::AppState;

pub mod handlers;

pub fn route() -> axum::routing::Router<AppState> {
    axum::Router::new()
        .route("/", axum::routing::get(handlers::get_tag_list::handle))
        .route("/{id}", axum::routing::get(handlers::get_tag_info::handle))
}