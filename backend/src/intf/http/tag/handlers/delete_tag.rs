use application::tag::remove_tag::RemoveTagRequest;
use axum::{Json, extract::{Path, State}, http::StatusCode};
use domain::error::IntoApiError;
use uuid::Uuid;

use crate::{http_exception, intf::http::ext::{into_response::AppResult, is_bd::IsBD, state::AppState}};

pub async fn handle(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    IsBD(is_bd): IsBD,
) -> AppResult<()>{
    if !is_bd {
        return Err(
            http_exception!(
                StatusCode::FORBIDDEN.into(),
                "FORBIDDEN".to_string(),
                None
            ).into()
        )
    }
    let _ = application::tag::remove_tag::handle(
        RemoveTagRequest { id },
        &state.tag_repo,
    ).await
    .map_err(|err| http_exception!(err.status_code(), err.message(), err.cause()))?;
    Ok(Json(()))
}