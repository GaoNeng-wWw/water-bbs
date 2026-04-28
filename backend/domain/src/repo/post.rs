use chrono::{DateTime, Utc};

use crate::prelude::{Post, PostId, RepositoryError};

#[async_trait::async_trait]
#[mockall::automock]
pub trait IPostRepo {
    async fn upsert(&self, post: &Post) -> Result<(), RepositoryError>;
    async fn remove_post(&self, post_id: &PostId) -> Result<(), RepositoryError>;
    async fn find_post(&self, post_id: &PostId) -> Result<Option<Post>, RepositoryError>;
    async fn list_post(&self, created_at: Option<DateTime<Utc>>, limit: Option<u64>) -> Result<Vec<Post>, RepositoryError>;
    async fn incr_post_count(&self) -> Result<(), RepositoryError>;
    async fn get_post_total(&self) -> Result<u32, RepositoryError>;
}