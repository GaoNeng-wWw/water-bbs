use axum::{Json, body::Body, extract::State, http::{Request, StatusCode}, middleware::Next, response::Response};

use crate::intf::http::ext::{current_account_id::CurrentAccountId, state::AppState};

pub async fn check_role(
    State(state): State<AppState>,
    CurrentAccountId(account_id): CurrentAccountId,
    req: Request<Body>,
    next: Next,
) -> Result<Response, (StatusCode, Json<serde_json::Value>)>  {
    let account = state.account_repo.get_account(&account_id)
        .await
        .map_err(|_| {
            (
                StatusCode::INTERNAL_SERVER_ERROR, 
                Json(serde_json::json!({
                    "code": 500, 
                    "message": "INTERNAL_SERVER_ERROR"
                }))
            )
        })?
        .ok_or_else(|| {
            (
                StatusCode::NOT_FOUND, 
                Json(serde_json::json!("{code: 404,message: \"ACCOUNT_NOT_FOUND\"}"))
            )
        })?;
    if !account.is_bd() {
        return Err((StatusCode::FORBIDDEN, Json(serde_json::json!("{code: 403,message: \"FORBIDDEN\"}"))));
    }

    Ok(next.run(req).await)
}