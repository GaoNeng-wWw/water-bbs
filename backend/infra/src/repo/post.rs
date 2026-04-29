use chrono::{DateTime, Utc};
use domain::{prelude::{IPostRepo, Post, PostId, RepositoryError}, vo::tag_id::TagId};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder, QuerySelect};

use crate::mapper;

pub struct PostRepo {
    db: DatabaseConnection,
}

impl PostRepo {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }
}

#[async_trait::async_trait]
impl IPostRepo for PostRepo {
    async fn upsert(&self, post: &Post) -> Result<(), RepositoryError>{
        let model = mapper::post::to_model(post);
        model.save(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError { reason: err.to_string() })?;
        Ok(())
    }
    async fn find_post(&self, post_id: &PostId) -> Result<Option<Post>, RepositoryError>{
        let post = crate::entity::post::Entity::find_by_id(post_id.clone().into_inner())
            .filter(crate::entity::post::Column::Status.eq("active"))
            .one(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError { reason: err.to_string() })?
            .map(|model| crate::mapper::post::to_domain(&model));
        Ok(post)
    }
    async fn list_post(&self, tag_id: Option<TagId>, created_at: Option<DateTime<Utc>>, limit: Option<u64>) -> Result<Vec<Post>, RepositoryError>{
        let mut query = crate::entity::post::Entity::find()
            .filter(crate::entity::post::Column::Status.eq("active"))
            .order_by(crate::entity::post::Column::CreatedAt, sea_orm::Order::Desc);
        
        if let Some(tag_id) = tag_id {
            query = query.filter(crate::entity::post_tag::Column::TagId.contains(tag_id.clone().into_inner()));
        }
        if let Some(created_at) = created_at {
            query = query.filter(crate::entity::post::Column::CreatedAt.gte(created_at));
        }
        let posts = query
            .limit(limit.unwrap_or(10))
            .all(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError { reason: err.to_string() })?
            .iter()
            .map(|model| crate::mapper::post::to_domain(&model))
            .collect();
        Ok(posts)
    }
}