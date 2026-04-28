use chrono::{DateTime, Utc};

use crate::{ar::tag::Tag, prelude::RepositoryError, vo::tag_id::TagId};

#[async_trait::async_trait]
pub trait ITagRepo {
    async fn upsert(&self, tag: &Tag) -> Result<(), RepositoryError>;
    async fn remove(&self, id: &TagId) -> Result<(), RepositoryError>;
    async fn list(&self, created_at: Option<DateTime<Utc>>, limit: Option<u64>) -> Result<Vec<Tag>, RepositoryError>;
    async fn count(&self) -> Result<u64, RepositoryError>;
    async fn get(&self, id: &TagId) -> Result<Tag, RepositoryError>;
}