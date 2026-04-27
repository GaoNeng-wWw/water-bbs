use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};

use crate::{http_exception, intf::http::ext::{into_response::AppResult, state::AppState}};
use application::{auth::register::Request};
use domain::error::IntoApiError;

#[derive(Clone,Debug,Deserialize,Serialize)]
pub struct RegisterDTO {
    pub identifier_type: String,
    pub identifier_value: String,
    pub cert_type: String,
    pub cert_value: String,
    pub username: String,
    pub invite_code: Option<String>,
    pub captcha: Option<String>,
}

#[derive(Clone,Debug,Deserialize,Serialize)]
pub struct RegisterResponse {}

pub async fn handler(
    State(state): State<AppState>,
    Json(req): Json<RegisterDTO>,
) -> AppResult<()> {
    let request = Request {
        ident_type: req.identifier_type,
        ident_value: req.identifier_value,
        username: req.username,
        cert_type: req.cert_type,
        cert_value: req.cert_value,
        invite_code: req.invite_code,
        captcha: req.captcha,
    };
    
    let repo = state.account_repo.clone();
    
    let _ = application::auth::register::handle(
        request,
        state.strategy,
        repo,
        state.verify_code_service.clone(),
        state.policy_provider.clone(),
    )
    .await
    .map_err(|err| {http_exception!(err.status_code(), err.message(), err.cause())})?;
    Ok(Json(()))
}