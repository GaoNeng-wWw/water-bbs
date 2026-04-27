use std::sync::Arc;

use crate::{application::auth::registor::Registor, infra::eventbus::EventBus};
use domain::{config::features::IFeaturePolicyProvider, repo::{account::IAccountRepo, session::ISessionRepo}, service::{token::ITokenService, verify_code::{IVerifyCodeService, VerifyCodeService}}};

#[derive(Clone)]
pub struct AppState {
    pub account_repo: Arc<dyn IAccountRepo + Send + Sync>,
    pub session_repo: Arc<dyn ISessionRepo + Send + Sync>,
    pub event_bus: Arc<dyn EventBus + Send + Sync>,
    pub redis: Arc<fred::prelude::Pool>,
    pub policy_provider: Arc<dyn IFeaturePolicyProvider + Send + Sync>,
    pub verify_code_service: Arc<dyn IVerifyCodeService + Send + Sync>,
    pub token_service: Arc<dyn ITokenService + Send + Sync>,
    pub strategy: Vec<Arc<dyn Registor + Send + Sync>>,
    pub jwk: Arc<josekit::jwk::Jwk>,
}