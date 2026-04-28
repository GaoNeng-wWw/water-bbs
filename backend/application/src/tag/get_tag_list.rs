use std::sync::Arc;

use chrono::{DateTime, Utc};
use domain::{prelude::{Tag, TagServiceError}, repo::tag::ITagRepo};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize)]
pub struct GetTagListRequest {
    pub created_at: Option<DateTime<Utc>>,
    pub limit: Option<u64>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct GetTagListResponse {
    pub data: Vec<Tag>,
    pub total: u64,
}

pub async fn handle(
    req: GetTagListRequest,
    tag_repo: &Arc<dyn ITagRepo + Send + Sync>,
) -> Result<GetTagListResponse, TagServiceError> {
    let tags = tag_repo.list(req.created_at, req.limit).await
        .map_err(|err| {
            match err {
                domain::prelude::RepositoryError::EntityNotFound => TagServiceError::TagNotFound,
                _ => unreachable!()
            }
        })?;
    let tag_total = tag_repo.count().await
        .map_err(|err| TagServiceError::TagNotFound)?;
    Ok(GetTagListResponse {
        data: tags,
        total: tag_total,
    })
}