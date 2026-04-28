use crate::{entity::tag as TagEntity};

use domain::{ar::tag::Tag, prelude::*, vo::tag_id::TagId};

/// 将数据库实体转换为领域模型
pub fn to_domain(model: &TagEntity::Model) -> Tag {
    Tag {
        id: TagId::new(model.id),
        name: model.name.clone(),
        created_at: model.created_at.into(),
        removed_at: model.removed_at.map(|v| v.to_utc()),
    }
}

/// 将领域模型转换为数据库实体
pub fn to_model(domain: &Tag) -> TagEntity::ActiveModel {
    TagEntity::ActiveModel {
        id: sea_orm::Set(domain.id.clone().into_inner()),
        name: sea_orm::Set(domain.name.clone()),
        created_at: sea_orm::Set(domain.created_at.into()),
        removed_at: sea_orm::Set(domain.removed_at.clone().map(|v| v.into())),
        ..Default::default()
    }
}
//