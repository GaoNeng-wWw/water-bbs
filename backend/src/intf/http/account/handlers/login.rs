use std::sync::Arc;

use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};

use crate::{http_exception, application::{self, auth::login::LoginRequest}, domain::error::IntoApiError, infra::token::jwt::JwtService, intf::http::ext::{into_response::AppResult, state::AppState}};

#[derive(Clone, Debug, Deserialize)]
pub struct LoginDTO {
    pub ident_type:String,
    pub ident_value:String,
    pub cert_type:String,
    pub cert_value:String,
}

#[derive(Clone, Debug, Serialize)]
pub struct LoginResponse {
    pub access_token: String,
    pub refresh_token: String,
}

pub async fn handle(
    Json(req): Json<LoginDTO>,
    State(state): State<AppState>,
) -> AppResult<LoginResponse> {
    let token_service = Arc::new(JwtService {});
    let repo = state.account_repo;
    let session_repo = state.session_repo;
    
    let token = application::auth::login::handler(&LoginRequest {
        ident_type: req.ident_type,
        ident_value: req.ident_value,
        cert_type: req.cert_type,
        cert_value: req.cert_value,
    }, repo, token_service, session_repo, state.jwk)
    .await
    .map_err(|err| http_exception!(err.status_code(), err.message(), err.cause()))?;
    Ok(
        LoginResponse {
            access_token: token.access_token,
            refresh_token: token.refresh_token,
        }
    )
}