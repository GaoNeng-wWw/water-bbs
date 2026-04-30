use std::sync::Arc;

use domain::{prelude::TagServiceError, repo::tag::ITagRepo, vo::tag_id::TagId};
use uuid::Uuid;

pub struct RemoveTagRequest {
    pub id: Uuid,
}

pub async fn handle(
    req: RemoveTagRequest,
    tag_repo: &Arc<dyn ITagRepo + Send + Sync>,
) -> Result<(), TagServiceError> {
    tag_repo.remove(&TagId::new(req.id)).await
        .map_err(|err| {return TagServiceError::RepoError(err)})?;
    Ok(())
}