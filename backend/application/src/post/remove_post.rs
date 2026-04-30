use std::sync::Arc;

use domain::prelude::{AccountId, IAccountRepo, IPostRepo, PostId, PostServiceError};

pub struct RemovePostRequest {
    pub id: PostId,
}

pub async fn handler(
    req: RemovePostRequest,
    actor: &AccountId,
    account_repo: &Arc<dyn IAccountRepo + Send + Sync>,
    post_repo: &Arc<dyn IPostRepo + Send + Sync>,
) -> Result<(), PostServiceError> {
    let post = post_repo.find_post(&req.id).await?
        .ok_or_else(|| PostServiceError::PostNotFound)?;
    if post.is_removed() {
        return Err(PostServiceError::PostNotFound);
    }
    let account = account_repo.get_account(actor).await?
        .ok_or_else(|| PostServiceError::ActorNotFound)?;
    if post.author_id != account.id && !account.is_bd() {
        return Err(PostServiceError::PermissionDenied);
    }
    let mut post = post;
    post.remove()
        .map_err(|_| {
            PostServiceError::PostNotFound
        })?;
    post_repo.upsert(&post)
        .await?;
    Ok(())
}