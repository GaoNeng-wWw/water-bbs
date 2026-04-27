use axum::{
    Json,
    extract::{FromRequest, Request},
};
use serde::de::DeserializeOwned;

use crate::{
    intf::http::ext::into_response::{AppError, BadRequestException},
};
use domain::{error::IntoApiError, validator::ValidateDto};

pub struct Validated<T>(pub T);

// #[async_trait]
impl<S, T> FromRequest<S> for Validated<T>
where
    T: DeserializeOwned + ValidateDto,
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        // 1. 尝试反序列化
        let Json(dto) = Json::<T>::from_request(req, state).await.map_err(|_| AppError(Box::new(BadRequestException(None))))?;
        dto.validate_to_domain().map_err(|e| AppError(Box::new(BadRequestException(e.cause()))))?;

        Ok(Validated(dto))
    }
}
