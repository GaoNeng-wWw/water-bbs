use chrono::{DateTime, Utc};

use crate::{domain::{ar::account::{Account, Cert, Identity}, vo::{account_id::AccountId, money::Money, profile::Profile}}, infra::entity::{account as account_entity, cert as cert_entity, identity as identity_entity}};

pub fn to_domain(
    model: &account_entity::Model,
    identities: Vec<Identity>,
    certs: Vec<Cert>,
    profiles: Profile,
    is_bd: bool,
) -> Account {
    Account {
        id: AccountId::new(model.id),
        money: Money::try_new(model.money).unwrap_or(Money::try_new(0).unwrap()),
        locked_money: Money::try_new(model.locked_money).unwrap_or(Money::try_new(0).unwrap()),
        bd: is_bd,
        identity: identities.into(),
        cert: certs.into(),
        profile: profiles.into(),
        created_at: model.created_at.into(),
        updated_at: model.updated_at.into(),
        deleted_at: model.removed_at.map(|v| v.into()),
    }
}

pub fn to_model(domain: &Account) -> account_entity::ActiveModel {
    account_entity::ActiveModel {
        id: sea_orm::Set(domain.id.clone().into_inner()),
        money: sea_orm::Set(domain.money.clone().into_inner()),
        locked_money: sea_orm::Set(domain.locked_money.clone().into_inner()),
        created_at: sea_orm::Set(domain.created_at.into()),
        updated_at: sea_orm::Set(domain.updated_at.into()),
        removed_at: sea_orm::Set(domain.deleted_at.clone().map(|v| v.into())),
        ..Default::default()
    }
}