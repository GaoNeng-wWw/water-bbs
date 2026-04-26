use axum::{
    Json,
    extract::{Query, State},
};
use derive_builder::Builder;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    app_err, domain::{error::IntoApiError, vo::account_id::AccountId}, http_exception, intf::http::ext::{into_response::AppResult, state::AppState}
};

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateProfileQuery {
    pub account_id: Uuid,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateProfileBody {
    pub name: Option<String>,
    pub bio: Option<String>,
    pub avatar: Option<String>
}

#[derive(Debug, Clone, Serialize, Builder)]
pub struct UpdateProfileResponse {
    pub id: Uuid,
    pub name: String,
    #[builder(default=None)]
    pub bio: Option<String>,
    #[builder(default=None)]
    pub avatar: Option<String>
}


pub async fn handle(
    State(state): State<AppState>,
    Query(query): Query<UpdateProfileQuery>,
    Json(body): Json<UpdateProfileBody>
) -> AppResult<UpdateProfileResponse> {
    let repo = state.account_repo;
    let account_id = AccountId::new(query.account_id);
    let account = repo.get_account(&account_id)
        .await
        .map_err(|err| http_exception!(err.status_code(), err.message(), err.cause()))?;
    if account.is_none() {
        return Err(
            app_err!(crate::intf::http::account::errors::account_not_found::AccuontNotFound {})
        )
    }
    let mut account = account.unwrap();
    let mut profile = account.profile.clone();
    if let Some(name) = body.name{
        profile.name = name;
    }
    if let Some(bio) = body.bio{
        profile.bio = Some(bio);
    }
    if let Some(avatar) = body.avatar{
        profile.avatar = Some(avatar);
    }
    account.update_profile(profile.clone());

    repo.update_account(&account)
        .await
        .map_err(|err| http_exception!(err.status_code(), err.message(), err.cause()))?;

    Ok(
        Json(
            UpdateProfileResponse {
                id: profile.id,
                name: profile.name,
                bio: profile.bio,
                avatar: profile.avatar,
            }
        )
    )
}
