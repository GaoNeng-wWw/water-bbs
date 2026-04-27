use axum::{Json, extract::State};
use serde::Deserialize;

use crate::{http_exception, intf::http::ext::{into_response::AppResult, state::AppState}};
use application::{auth::reset_cert::ResetCertRequest};
use domain::error::IntoApiError;

#[derive(Clone, Deserialize)]
pub struct ResetCertDTO {
    pub mfa_code: String,
    pub ident_type: String,
    pub ident_value: String,
    pub cert_type: String,
    pub cert_value: String,
}

#[axum::debug_handler]
pub async fn handler(
    State(state): State<AppState>,
    Json(dto): Json<ResetCertDTO>,
) -> AppResult<()> {
    application::auth::reset_cert::handle(
        &ResetCertRequest {
            mfa_code: dto.mfa_code,
            ident_type: dto.ident_type,
            ident_value: dto.ident_value,
            cert_type: dto.cert_type,
            cert_value: dto.cert_value,
        },
        state.account_repo,
        state.event_bus,
        state.verify_code_service
    )
    .await
    .map_err(|err| {
        http_exception!(err.status_code(),err.message(),err.cause())
    })?;
    Ok(Json(()))
}