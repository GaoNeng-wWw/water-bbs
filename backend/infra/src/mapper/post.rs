use crate::entity::post as post_entity;
use domain::prelude::*;

pub fn to_domain(model: &post_entity::Model) -> Post {
    Post {
        id: PostId::new(model.id),
        title: model.title.clone(),
        author_id: AccountId::new(model.author_id),
        tag_ids: vec![],
        created_at: model.created_at.into(),
        updated_at: model.updated_at.into(),
        status: model.status.clone().into(),
        inbox: vec![],
    }
}

pub fn to_model(domain: &Post) -> post_entity::ActiveModel {
    post_entity::ActiveModel {
        id: sea_orm::Set(domain.id.clone().into_inner()),
        author_id: sea_orm::Set(domain.author_id.clone().into_inner()),
        title: sea_orm::Set(domain.title.clone()),
        created_at: sea_orm::Set(domain.created_at.into()),
        updated_at: sea_orm::Set(domain.updated_at.into()),
        status: sea_orm::Set(domain.status.to_string()),
        ..Default::default()
    }
}