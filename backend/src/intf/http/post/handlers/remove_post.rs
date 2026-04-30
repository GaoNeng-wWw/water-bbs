use application::post::remove_post::RemovePostRequest;
use axum::{Json, extract::{Path, State}};
use domain::{error::IntoApiError, prelude::PostId};
use uuid::Uuid;

use crate::{http_exception, intf::http::ext::{current_account_id::CurrentAccountId, into_response::AppResult, state::AppState}};

pub async fn handle(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    CurrentAccountId(account_id): CurrentAccountId,
) -> AppResult<()>{
    let _ = application::post::remove_post::handler(
        RemovePostRequest { id: PostId::new(id) },
        &account_id,
        &state.account_repo,
        &state.post_repo
    )
    .await
    .map_err(|err| http_exception!(err.status_code(), err.message(), err.cause()))?;
    Ok(Json(()))
}