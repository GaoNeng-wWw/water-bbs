use crate::{application::account::error::AccountServiceError, domain::repo::account::IAccountRepo};

pub struct RegisterRequest {
    pub ident_type: String,
    pub ident_value: String,
    pub cert_type: String,
    pub cert_value: String,
    pub name: String,
}

pub trait Registor {
    async fn validate(&self, value: &str) -> bool;
    async fn perform_registration(&self, data: &RegisterRequest, repo: &dyn IAccountRepo) -> Result<(), AccountServiceError>;
}

