use domain::{prelude::{RepositoryError, TagBuilder, TagServiceError}, repo::tag::ITagRepo};
use uuid::Uuid;

pub struct CreateTagRequest {
    pub name: String,
}

pub struct CreateTagResponse {
    pub id: Uuid,
    pub name: String,
}

pub async fn handle(
    req: CreateTagRequest,
    tag_repo: &dyn ITagRepo,
) -> Result<CreateTagResponse, TagServiceError> {
    let tag = TagBuilder::default()
        .name(req.name)
        .build()
        .unwrap();
    tag_repo.upsert(&tag).await
        .map_err(|err| {return RepositoryError::DatabaseError { reason: err.to_string() }})?;
    Ok(CreateTagResponse {
        id: tag.id.into(),
        name: tag.name,
    })
}