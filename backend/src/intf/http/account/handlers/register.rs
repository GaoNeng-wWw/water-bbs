use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};

use crate::intf::http::ext::{into_response::AppResult, state::AppState};

#[derive(Clone,Debug,Deserialize,Serialize)]
pub struct RegisterDTO {
    pub identifier_type: String,
    pub identifier_value: String,
    pub cert_type: String,
    pub cert_value: String,
    pub username: String,
}

#[derive(Clone,Debug,Deserialize,Serialize)]
pub struct RegisterResponse {}

pub async fn handler(
    Json(req): Json<RegisterDTO>,
    State(state): State<AppState>,
) -> AppResult<()> {
    Ok(())
}