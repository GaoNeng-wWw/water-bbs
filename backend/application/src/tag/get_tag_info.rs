use std::sync::Arc;

use domain::{prelude::TagServiceError, repo::tag::ITagRepo, vo::tag_id::TagId};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Clone, Debug, Deserialize)]
pub struct GetTagInfoRequest {
    pub id: Uuid,
}

pub struct GetTagInfoResponse {
    pub id: Uuid,
    pub name: String,
}

pub async fn handle(
    req: GetTagInfoRequest,
    tag_repo: &Arc<dyn ITagRepo + Send + Sync>,
) -> Result<GetTagInfoResponse, TagServiceError> {
    let tag = tag_repo.get(&TagId::new(req.id)).await
        .map_err(|err| {
            match err {
                domain::prelude::RepositoryError::EntityNotFound => TagServiceError::TagNotFound,
                _ => unreachable!()
            }
        })?;
    Ok(GetTagInfoResponse {
        id: tag.id.into(),
        name: tag.name,
    })
}