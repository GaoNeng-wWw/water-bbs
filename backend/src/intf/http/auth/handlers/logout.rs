use axum::{Json, extract::State};
use headers::{Authorization, authorization::Bearer};
use axum_extra::TypedHeader;

use crate::{intf::http::ext::{into_response::AppResult, state::AppState}};
use application;


pub async fn handler(
    TypedHeader(auth): TypedHeader<Authorization<Bearer>>,
    State(state):State<AppState>
) -> AppResult<()>{
    let token = auth.token();
    application::auth::logout::handler(
        &application::auth::logout::LogoutRequest { token: token.to_string() },
        state.jwk,
        state.token_service,
        state.session_repo,
        state.event_bus
    );
    Ok(
        Json(())
    )
}