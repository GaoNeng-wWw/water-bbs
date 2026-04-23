pub mod mail;

use std::sync::Arc;

use crate::{
    application::auth::error::RegistoryError,
    domain::{
        config::features::IFeaturePolicyProvider, repo::account::IAccountRepo, service::{mailer::Mailer, verify_code::VerifyCodeService}
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
pub struct RegistorContext {
    pub repo: Arc<dyn IAccountRepo + Send + Sync>,
    pub verify_code: Arc<VerifyCodeService>,
    pub policy_provider: Arc<dyn IFeaturePolicyProvider + Send + Sync>,
}

#[async_trait::async_trait]
pub trait Registor {
    async fn validate(&self, value: &str) -> bool;
    async fn perform_registration(
        &self,
        request: &RegisterRequest,
        context: &RegistorContext,
    ) -> Result<(), RegistoryError>;
}
