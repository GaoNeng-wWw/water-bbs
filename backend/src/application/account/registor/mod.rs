pub mod mail;

use std::sync::Arc;

use crate::{
    application::account::error::RegistoryError,
    domain::{
        repo::account::IAccountRepo,
        service::{mailer::Mailer, verify_code::IVerifyCodeService},
    },
};

#[derive(Clone)]
pub struct RegisterRequest {
    pub ident_type: String,
    pub ident_value: String,
    pub cert_type: String,
    pub cert_value: String,
    pub name: String,
}

#[derive(Clone)]
pub struct RegistoryContext {
    pub repo: Arc<dyn IAccountRepo + Send + Sync>,
    pub mailer: Arc<dyn Mailer + Send + Sync>,
    pub verify_code: Arc<dyn IVerifyCodeService + Send + Sync>,
    pub code_free: bool,
}

#[async_trait::async_trait]
pub trait Registor {
    async fn validate(&self, value: &str) -> bool;
    async fn perform_registration(
        &self,
        request: &RegisterRequest,
        context: &RegistoryContext,
    ) -> Result<(), RegistoryError>;
}
