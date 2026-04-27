use uuid::Uuid;

use crate::{infra::entity::profile as profile_entity};
use domain::prelude::*;

pub fn to_domain(model: &profile_entity::Model) -> Profile {
    Profile {
        id: model.id.clone(),
        name: model.name.clone(),
        bio: model.bio.clone(),
        avatar: model.avatar.clone(),
    }
}

pub fn to_model(domain: &Profile, account_id: &Uuid) -> profile_entity::ActiveModel {
    profile_entity::ActiveModel {
        id: sea_orm::Set(Uuid::now_v7()),
        account_id: sea_orm::Set(account_id.clone()),
        name: sea_orm::Set(domain.name.clone()),
        bio: sea_orm::Set(domain.bio.clone()),
        avatar: sea_orm::Set(domain.avatar.clone()),
        ..Default::default()
    }
}