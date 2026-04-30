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
    async fn list_post(&self, tag_id: Option<TagId>, post_id: Option<PostId>, limit: Option<u64>) -> Result<Vec<Post>, RepositoryError>{
        let mut query = crate::entity::post::Entity::find()
            .filter(crate::entity::post::Column::Status.eq("active"))
            .order_by_id(sea_orm::Order::Desc);
        
        
        if let Some(tag_id) = tag_id {
            query = query.filter(crate::entity::post_tag::Column::TagId.contains(tag_id.clone().into_inner()));
        }

        let mut cursor_handle = query
                .cursor_by(crate::entity::post::Column::Id);

        if post_id.is_none() {
            let data = cursor_handle
                .first(limit.unwrap_or(20))
                .all(&self.db).await
                .map_err(|err| RepositoryError::DatabaseError { reason: err.to_string() })?.iter()
                .map(|model| crate::mapper::post::to_domain(&model))
                .collect();
            return Ok(data)
        }
        let next_page = cursor_handle
            .first(limit.unwrap_or(10))
            .all(&self.db).await
            .map_err(|err| RepositoryError::DatabaseError { reason: err.to_string() })?.iter()
            .map(|model| crate::mapper::post::to_domain(&model))
            .collect::<Vec<_>>();
        Ok(next_page)
    }
}