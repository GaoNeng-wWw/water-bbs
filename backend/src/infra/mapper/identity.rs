use uuid::Uuid;

use crate::{domain::ar::account::Identity, infra::entity::identity as identity_entity};

pub fn to_domain(model: &identity_entity::Model) -> Identity {
    Identity {
        id: model.id,
        ident_type: model.ident_type.clone(),
        ident_value: model.ident_value.clone(),
        ident_verified: model.ident_verified,
    }
}
pub fn to_model(domain: &Identity, account_id: Uuid) -> identity_entity::ActiveModel {
    identity_entity::ActiveModel {
        id: sea_orm::Set(domain.id),
        account_id: sea_orm::Set(account_id),
        ident_type: sea_orm::Set(domain.ident_type.clone()),
        ident_value: sea_orm::Set(domain.ident_value.clone()),
        ident_verified: sea_orm::Set(domain.ident_verified),
    }
}