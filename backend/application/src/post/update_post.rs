use std::sync::Arc;

use domain::{prelude::{IPostRepo, PostId, PostServiceError}, vo::tag_id::TagId};

pub struct UpdatePostRequest {
    pub id: PostId,
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
    post_repo: &Arc<dyn IPostRepo + Send + Sync>,
) -> Result<UpdatePostResponse, PostServiceError> {
    let post = post_repo.find_post(&req.id)
        .await?;
    if post.is_none() {
        return Err(PostServiceError::PostNotFound);
    }
    let mut post = post.unwrap();
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