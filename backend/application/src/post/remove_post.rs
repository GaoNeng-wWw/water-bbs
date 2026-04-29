use std::sync::Arc;

use domain::prelude::{IPostRepo, PostId, PostServiceError};

pub struct RemovePostRequest {
    pub id: PostId,
}

pub async fn handler(
    req: RemovePostRequest,
    post_repo: &Arc<dyn IPostRepo + Send + Sync>,
) -> Result<(), PostServiceError> {
    let post = post_repo.find_post(&req.id).await?;
    if post.is_none() || post.as_ref().unwrap().is_removed() {
        return Err(PostServiceError::PostNotFound);
    }
    let mut post = post.unwrap();
    post.remove()
        .map_err(|_| {
            PostServiceError::PostNotFound
        })?;
    post_repo.upsert(&post)
        .await?;
    Ok(())
}