use application::post::update_post::UpdatePostRequest;
use axum::{Json, extract::{Path, State}};
use domain::{error::IntoApiError, prelude::PostId, vo::tag_id::TagId};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{http_exception, intf::http::ext::{current_account_id::CurrentAccountId, into_response::AppResult, state::AppState}};

#[derive(Debug,Clone,Serialize,Deserialize)]
pub struct UpdatePost {
    pub title: Option<String>,
    pub tag_ids: Option<Vec<Uuid>>,
}

pub async fn handle(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    CurrentAccountId(account_id): CurrentAccountId,
    Json(update_post): Json<UpdatePost>,
) -> AppResult<()>{
    let _ = application::post::update_post::handler(
        UpdatePostRequest { 
                id: PostId::new(id), 
                account_id, 
                title: update_post.title,
                tag_ids: update_post.tag_ids.map(|tag_ids| tag_ids.into_iter().map(|tag_id| TagId::new(tag_id)).collect()),
            },
        &state.account_repo,
        &state.post_repo
    )
    .await
    .map_err(|err| http_exception!(err.status_code(), err.message(), err.cause()))?;
    Ok(Json(()))
}