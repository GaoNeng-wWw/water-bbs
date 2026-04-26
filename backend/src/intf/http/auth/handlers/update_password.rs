use axum::{Json, extract::State};
use axum_extra::TypedHeader;
use headers::{Authorization, authorization::Bearer};
use serde::Serialize;

use crate::{application::{self, auth::update_cert::UpdateCertRequest}, domain::error::IntoApiError, http_exception, intf::http::ext::{into_response::AppResult, state::AppState}};

#[derive(Clone, Serialize)]
pub struct UpdatePasswordBody {
    ident_type: String,
    ident_value: String,
    cert_type: String,
    cert_value: String,
    old_cert_value: String,
    mfa_code: String
}

pub async fn handle(
    TypedHeader(auth): TypedHeader<Authorization<Bearer>>,
    State(state):State<AppState>,
    Json(json): Json<UpdatePasswordBody>
) -> AppResult<()> {
    let token = auth.token();
    let _ = application::auth::update_cert::handle(
        UpdateCertRequest {
            ident_type: json.ident_type,
            ident_value: json.ident_value,
            mfa_code: json.mfa_code,
            token: token.to_string(),
            cert_type: json.cert_type,
            cert_value: json.cert_value,
            old_cert_value: json.old_cert_value,
        }, state.jwk, state.account_repo, state.event_bus, state.token_service, state.verify_code_service
    )
        .await
        .map_err(|err| {
            http_exception!(err.status_code(), err.message(), err.cause())
        })?;
    Ok(Json(()))
}