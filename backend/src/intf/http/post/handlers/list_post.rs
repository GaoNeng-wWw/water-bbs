use application::post::list_post::ListPostResponse;
use axum::{Json, extract::{Query, State}};
use domain::error::IntoApiError;
use serde::{Deserialize};
use uuid::Uuid;

use crate::{http_exception, intf::http::ext::{into_response::AppResult, state::AppState}};

#[derive(Deserialize)]
pub struct ListPostRequest {
    pub tag_id: Option<Uuid>,
    pub post_id: Option<Uuid>,
    pub limit: Option<u64>,
}

pub async fn handler(
    State(state): State<AppState>,
    Query(req): Query<ListPostRequest>,
) -> AppResult<ListPostResponse>{
    let resp = application::post::list_post::handler(
        application::post::list_post::ListPostRequest {
            tag_id: req.tag_id,
            post_id: req.post_id,
            limit: req.limit,
        },
        &state.tag_repo,
        &state.post_repo,
        &state.cqrs_state.fetch_profile,
    )
    .await
    .map_err(|err| http_exception!(err.status_code(), err.message(), err.cause()))?;
    Ok(Json(resp))
}
