use chrono::{DateTime, Utc};

use crate::{prelude::{Post, PostId, RepositoryError}, vo::tag_id::TagId};

#[async_trait::async_trait]
#[mockall::automock]
pub trait IPostRepo {
    async fn upsert(&self, post: &Post) -> Result<(), RepositoryError>;
    async fn find_post(&self, post_id: &PostId) -> Result<Option<Post>, RepositoryError>;
    async fn list_post(&self, tag_id: Option<TagId>, created_at: Option<DateTime<Utc>>, limit: Option<u64>) -> Result<Vec<Post>, RepositoryError>;
}