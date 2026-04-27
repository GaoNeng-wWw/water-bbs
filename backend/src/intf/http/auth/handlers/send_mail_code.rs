use axum::{Json, extract::State};
use serde::Deserialize;

use crate::{http_exception, intf::http::ext::{into_response::AppResult, state::AppState}};
use domain::error::IntoApiError;
use shared;

#[derive(Clone, Deserialize)]
pub struct SendMailCode {
    pub target: String,
}
pub async fn handler(
    State(state): State<AppState>,
    Json(body): Json<SendMailCode>,
) -> AppResult<()> {
    let code = shared::random::generator::digital(8);
    state
        .verify_code_service
        .send_code(domain::service::verify_code::Channel::Email, &body.target, &code)
        .await
        .map_err(|err| {http_exception!(err.status_code(), err.message(), err.cause())})?;
    Ok(Json(()))
}