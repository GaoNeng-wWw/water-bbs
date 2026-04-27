use uuid::Uuid;
use crate::{infra::entity::cert as cert_entity};
use domain::prelude::*;

pub fn to_domain(model: &cert_entity::Model) -> Cert {
    Cert::new(model.id, model.cert_type.clone(), model.cert_value.clone())

}
pub fn to_model(domain: &Cert, account_id: Uuid) -> cert_entity::ActiveModel {
    cert_entity::ActiveModel {
        id: sea_orm::Set(domain.id),
        account_id: sea_orm::Set(account_id),
        cert_type: sea_orm::Set(domain.cert_type.clone()),
        cert_value: sea_orm::Set(domain.cert_value.clone()),
    }
}