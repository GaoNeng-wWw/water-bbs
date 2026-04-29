use std::sync::Arc;

use domain::{
    prelude::{AccountId, IPostRepo, PostId, PostServiceError, query::error::QueryError},
    repo::tag::ITagRepo,
    vo::tag_id::TagId,
};
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct ListPostRequest {
    pub tag_id: Option<Uuid>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub limit: Option<u64>,
}

pub struct PostAuthorSummary {
    pub account_id: AccountId,
    pub name: String,
    pub bio: Option<String>,
    pub avatar: Option<String>,
}
pub struct PostInfo {
    pub id: PostId,
    pub title: String,
    pub author: PostAuthorSummary,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

pub struct ListPostResponse {
    pub posts: Vec<PostInfo>,
    pub total: u32,
}

pub async fn handler<Q>(
    req: ListPostRequest,
    tag_repo: &Arc<dyn ITagRepo + Send + Sync>,
    post_repo: &Arc<dyn IPostRepo + Send + Sync>,
    fetch_profile: Q,
) -> Result<ListPostResponse, PostServiceError>
where
    Q: cqrs::query::Query<
            Result = cqrs::query::fetch_profile::FetchProfileResult,
            Error = QueryError,
            Query = cqrs::query::fetch_profile::FetchProfileQuery,
        >,
{
    let posts = post_repo
        .list_post(
            req.tag_id.map(|id| TagId::new(id)),
            req.created_at,
            req.limit,
        )
        .await?;
    let mut data = Vec::with_capacity(posts.capacity());
    for i in 0..posts.len() {
        let post = &posts[i];
        let author_id = post.author_id.clone();
        let post_id = post.id.clone();
        let title = post.title.clone();
        let profile = fetch_profile
            .execute(&cqrs::query::fetch_profile::FetchProfileQuery {
                account_id: author_id,
            })
            .await
            .map_err(|err| {
                return PostServiceError::QueryError(err);
            })?;
        data[i] = PostInfo {
            id: post_id,
            title,
            author: PostAuthorSummary {
                account_id: profile.account_id,
                name: profile.name,
                bio: profile.bio,
                avatar: profile.avatar,
            },
            created_at: post.created_at,
        };
    }

    let total = tag_repo
        .get_post_total(req.tag_id.map(|id| TagId::new(id)))
        .await?;
    Ok(ListPostResponse { posts: data, total })
}
