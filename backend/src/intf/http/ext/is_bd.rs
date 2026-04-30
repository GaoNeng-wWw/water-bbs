use axum::{
    extract::FromRequestParts,
    http::{
        StatusCode,
        request::Parts,
    },
};
use domain::prelude::{AccountId};
use headers::{Authorization, HeaderMapExt, authorization::Bearer};

use crate::intf::http::ext::state::AppState;

pub struct IsBD(pub bool);

impl FromRequestParts<AppState> for IsBD
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
        let token = parts.headers
            .typed_get::<Authorization<Bearer>>()
            .ok_or_else(|| (StatusCode::BAD_REQUEST, "NOT_AUTHORIZED".to_string()))?;
        let token = token.token();
        let token = state.token_service.verify_token(token, &state.jwk)
            .map_err(|_| (StatusCode::UNAUTHORIZED, "TOKEN_EXPIRED".to_string()))?;
        let account = state.account_repo.get_account(&token.sub)
            .await
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "INTERNAL_ERROR".to_string()))?
            .ok_or_else(|| (StatusCode::BAD_REQUEST, "NOT_AUTHORIZED".to_string()))?;
        Ok(Self(account.is_bd()))
    }
}