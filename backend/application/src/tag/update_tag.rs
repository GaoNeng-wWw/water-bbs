use domain::{prelude::TagServiceError, repo::tag::ITagRepo, vo::tag_id::TagId};
use uuid::Uuid;

pub struct UpdateTagRequest {
    pub id: Uuid,
    pub name: String,
}

pub struct UpdateTagResponse {
    pub id: Uuid,
    pub name: String,
}

pub async fn handle(
    req: UpdateTagRequest,
    tag_repo: &dyn ITagRepo,
) -> Result<UpdateTagResponse, TagServiceError> {
    let mut tag = tag_repo.get(&TagId::new(req.id)).await
        .map_err(|err| {
            match err {
                domain::prelude::RepositoryError::EntityNotFound => TagServiceError::TagNotFound,
                _ => unreachable!()
            }
        })?;
    tag.name = req.name;
    tag_repo.upsert(&tag).await
        .map_err(|err| {return TagServiceError::RepoError(err)})?;
    Ok(UpdateTagResponse {
        id: tag.id.into(),
        name: tag.name,
    })
}