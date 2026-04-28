use axum::{Json, extract::{Path, State}};
use domain::error::IntoApiError;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{http_exception, intf::http::ext::{into_response::AppResult, state::AppState}};

#[derive(Clone, Debug, Deserialize)]
pub struct GetTagInfoRequest {
    pub id: Uuid,
}

#[derive(Clone, Debug, Serialize)]
pub struct GetTagInfoResponse {
    pub id: Uuid,
    pub name: String,
}

pub async fn handle(
    State(state): State<AppState>,
    Path(path): Path<GetTagInfoRequest>,
) -> AppResult<GetTagInfoResponse> {
    let resp = application::tag::get_tag_info::handle(
        application::tag::get_tag_info::GetTagInfoRequest {
            id: path.id,
        }, &state.tag_repo
    )
    .await
    .map_err(|err| http_exception!(err.status_code(), err.message(), err.cause()))?;
    Ok(
        Json(
            GetTagInfoResponse {
                id: resp.id,
                name: resp.name,
            }
        )
    )
}