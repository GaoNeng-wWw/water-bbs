use chrono::{DateTime, Utc};
use domain::{ar::tag::Tag, prelude::RepositoryError, repo::tag::ITagRepo, vo::tag_id::TagId};
use fred::prelude::{KeysInterface, Pool};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect};
use tokio::sync::Mutex;

use crate::mapper;

pub struct TagRepo {
    db: DatabaseConnection,
    redis: Pool,
    cnt_thread: Mutex<Option<tokio::task::JoinHandle<Result<u64, RepositoryError>>>>,
}

impl TagRepo {
    pub fn new(db: DatabaseConnection, redis: Pool) -> Self {
        Self { db, redis, cnt_thread: Mutex::new(None) }
    }
}


const TAG_COUNT:&str = "CNT:TAG";

fn post_count_key(tag_id: &TagId) -> String {
    format!("CNT:POST:{}", tag_id.clone().into_inner())
}
fn post_total_key() -> String {
    format!("CNT:POST")
}

#[async_trait::async_trait]
impl ITagRepo for TagRepo {
    async fn incr_post_count(&self, tag_id: &TagId) -> Result<(), RepositoryError> {
        self.redis.incr::<(),&str>(post_count_key(tag_id).as_str()).await.map_err(|err| RepositoryError::RedisError { reason: err.to_string() })?;
        self.redis.incr::<(),&str>(post_total_key().as_str()).await.map_err(|err| RepositoryError::RedisError { reason: err.to_string() })?;
        Ok(())
    }
    async fn decr_post_count(&self, tag_id: &TagId) -> Result<(), RepositoryError> {
        self.redis.decr::<(),&str>(post_count_key(tag_id).as_str()).await.map_err(|err| RepositoryError::RedisError { reason: err.to_string() })?;
        Ok(())
    }
    async fn get_post_total(&self, tag_id: Option<TagId>) -> Result<u32, RepositoryError> {
        if tag_id.is_none() {
            return Ok(self.redis.get::<u32,&str>(post_total_key().as_str()).await.map_err(|err| RepositoryError::RedisError { reason: err.to_string() })?);
        }
        let count = self.redis.get::<u32,&str>(
                post_count_key(
                    &tag_id.unwrap()
                ).as_str()
            ).await.map_err(|err| RepositoryError::RedisError { reason: err.to_string() })?;
        Ok(count)
    }
    async fn upsert(&self, tag: &Tag) -> Result<(), RepositoryError> {
        crate::mapper::tag::to_model(tag)
            .save(&self.db)
            .await.map_err(|err| RepositoryError::DatabaseError { reason: err.to_string() })?;
        self.redis.incr::<(),&str>(TAG_COUNT).await.map_err(|err| RepositoryError::RedisError { reason: err.to_string() })?;
        Ok(())
    }
    async fn remove(&self, id: &TagId) -> Result<(), RepositoryError> {
        let model = crate::entity::tag::Entity::find_by_id(id.clone().into_inner())
            .filter(crate::entity::tag::Column::RemovedAt.is_null())
            .one(&self.db)
            .await.map_err(|err| RepositoryError::DatabaseError { reason: err.to_string() })?;
        if model.is_none() {
            return Err(RepositoryError::EntityNotFound);
        }
        let mut model = mapper::tag::to_domain(&model.unwrap());
        model.remove().unwrap();
        crate::mapper::tag::to_model(&model)
            .save(&self.db)
            .await.map_err(|err| RepositoryError::DatabaseError { reason: err.to_string() })?;
        Ok(())
    }
    async fn list(&self, created_at: Option<DateTime<Utc>>, limit: Option<u64>) -> Result<Vec<Tag>, RepositoryError> {
        let mut query = crate::entity::tag::Entity::find()
            .filter(crate::entity::tag::Column::RemovedAt.is_null())
            .order_by_desc(crate::entity::tag::Column::CreatedAt);
        if let Some(created_at) = created_at {
            query = query.filter(crate::entity::tag::Column::CreatedAt.gte(created_at));
        }
        query = query.limit(limit.unwrap_or(10));
        let models = query
            .all(&self.db)
            .await.map_err(|err| RepositoryError::DatabaseError { reason: err.to_string() })?;
        let tags = models.into_iter().map(|v| mapper::tag::to_domain(&v)).collect::<Vec<_>>();
        Ok(tags)
    }
    async fn count(&self) -> Result<u64, RepositoryError> {
        let cnt_handle = self.redis.get::<u64, &str>(TAG_COUNT).await.map_err(|err| RepositoryError::RedisError { reason: err.to_string() });
        if let Ok(cnt) = cnt_handle {
            return Ok(cnt);
        }
        if let Some(handle) = self.cnt_thread.lock().await.take() {
            if handle.is_finished() {
                *self.cnt_thread.lock().await = None;
                let res = match handle.await {
                    Ok(cnt) => Ok(cnt),
                    Err(err) => return Err(
                        RepositoryError::ThreadError {
                            reason: err.to_string(),
                        }
                    ),
                }?;
                return res;
            } else {
                return Ok(0);
            }
        }
        let redis = self.redis.clone();
        let db = self.db.clone();
        let handle: tokio::task::JoinHandle<Result<u64, RepositoryError>> = tokio::spawn(async move {
            let cnt = crate::entity::tag::Entity::find()
                .filter(crate::entity::tag::Column::RemovedAt.is_null())
                .count(&db)
                .await
                .map_err(|err| {
                    RepositoryError::DatabaseError { reason: err.to_string() }
                })?;
            let _:() = redis.set(TAG_COUNT, cnt, None, None, false)
                .await
                .map_err(|err| RepositoryError::RedisError { reason: err.to_string() })?;
            Ok(cnt)
        });
        *self.cnt_thread.lock().await = Some(handle);
        Ok(0)
    }
    async fn get(&self, id: &TagId) -> Result<Tag, RepositoryError> {
        let model = crate::entity::tag::Entity::find_by_id(id.clone().into_inner())
            .filter(crate::entity::tag::Column::RemovedAt.is_null())
            .one(&self.db)
            .await.map_err(|err| RepositoryError::DatabaseError { reason: err.to_string() })?;
        if model.is_none() {
            return Err(RepositoryError::EntityNotFound);
        }
        let model = mapper::tag::to_domain(&model.unwrap());
        Ok(model)
    }
}
