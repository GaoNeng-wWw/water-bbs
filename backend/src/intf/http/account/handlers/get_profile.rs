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
pub struct GetProfileRequest {
    pub account_id: Uuid,
}

#[derive(Debug, Clone, Serialize, Builder)]
pub struct GetProfileResponse {
    pub id: Uuid,
    pub name: String,
    #[builder(default=None)]
    pub bio: Option<String>,
    #[builder(default=None)]
    pub avatar: Option<String>
}


pub async fn handle(State(state): State<AppState>, Query(query): Query<GetProfileRequest>) -> AppResult<GetProfileResponse> {
    let repo = state.account_repo;
    let account_id = AccountId::new(query.account_id);
    let account = repo
        .get_account(&account_id)
        .await
        .map_err(|err| http_exception!(err.status_code(), err.message(), err.cause()))?;
    if account.is_none(){
        return Err(
            app_err!(crate::intf::http::account::errors::account_not_found::AccuontNotFound {})
        );
    }
    let account = account.unwrap();
    let profile = account.profile;

    let resp= GetProfileResponseBuilder::create_empty()
        .id(profile.id)
        .name(profile.name)
        .avatar(profile.avatar)
        .bio(profile.bio)
        .build()
        .unwrap();
    Ok(Json(resp))
}
