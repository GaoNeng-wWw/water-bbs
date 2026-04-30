use std::sync::Arc;

use domain::{prelude::{AccountId, IAccountRepo, IPostRepo, PostId, PostServiceError}, vo::tag_id::TagId};

pub struct UpdatePostRequest {
    pub id: PostId,
    pub account_id: AccountId,
    pub title: Option<String>,
    pub tag_ids: Option<Vec<TagId>>,
}

pub struct UpdatePostResponse {
    pub id: PostId,
    pub title: String,
    pub tag_ids: Vec<TagId>,
}

pub async fn handler(
    req: UpdatePostRequest,
    account_repo: &Arc<dyn IAccountRepo + Send + Sync>,
    post_repo: &Arc<dyn IPostRepo + Send + Sync>,
) -> Result<UpdatePostResponse, PostServiceError> {
    let post = post_repo.find_post(&req.id)
        .await?
        .ok_or_else(|| PostServiceError::PostNotFound)?;
    let account = account_repo.get_account(&req.account_id)
        .await?
        .ok_or_else(|| PostServiceError::ActorNotFound)?;

    if post.author_id != account.id && !account.is_bd(){
        return Err(PostServiceError::ActorNotFound);
    }

    let mut post = post;
    if post.is_removed() {
        return Err(PostServiceError::PostNotFound);
    }
    if let Some(title) = req.title {
        post.update_title(title);
    }
    if let Some(tag_ids) = req.tag_ids {
        post.update_tag_ids(tag_ids);
    }
    
    post_repo.upsert(&post)
        .await?;
    Ok(UpdatePostResponse {
        id: post.id,
        title: post.title,
        tag_ids: post.tag_ids,
    })
}