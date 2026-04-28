use axum::{Json, extract::State};
use domain::error::IntoApiError;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{http_exception, intf::http::ext::{into_response::AppResult, state::AppState}};

#[derive(Clone, Debug, Deserialize)]
pub struct GetTagListRequest {
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub limit: Option<u64>,
}

#[derive(Clone, Debug, Serialize)]
pub struct TagInfo {
    pub id: Uuid,
    pub name: String,
}

#[derive(Clone, Debug, Serialize)]
pub struct GetTagListResponse {
    pub tags: Vec<TagInfo>,
    pub total: u64,
}



pub async fn handle(
    State(state): State<AppState>,
    Json(req): Json<GetTagListRequest>,
) -> AppResult<GetTagListResponse> {
    let resp = application::tag::get_tag_list::handle(
        application::tag::get_tag_list::GetTagListRequest {
            created_at: req.created_at,
            limit: req.limit,
        },
        &state.tag_repo
    )
    .await
    .map_err(|err| http_exception!(err.status_code(), err.message(), err.cause()))?;
    Ok(
        Json(
            GetTagListResponse {
                tags: resp.data.into_iter().map(|tag| TagInfo {
                    id: tag.id.into_inner(),
                    name: tag.name,
                }).collect(),
                total: resp.total,
            }
        )
    )
}