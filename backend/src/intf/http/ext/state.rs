use std::sync::Arc;

use crate::{domain::{config::features::IFeaturePolicyProvider, repo::{account::IAccountRepo, session::ISessionRepo}, service::{token::{ITokenService}, verify_code::VerifyCodeService}}, infra::eventbus::EventBus};

#[derive(Clone)]
pub struct AppState {
    pub account_repo: Arc<dyn IAccountRepo + Send + Sync>,
    pub session_repo: Arc<dyn ISessionRepo + Send + Sync>,
    pub event_bus: Arc<dyn EventBus + Send + Sync>,
    pub redis: Arc<fred::prelude::Pool>,
    pub policy_provider: Arc<dyn IFeaturePolicyProvider + Send + Sync>,
    pub verify_code_service: Arc<VerifyCodeService>,
    pub token_service: Arc<dyn ITokenService + Send + Sync>,
    pub jwk: Arc<josekit::jwk::Jwk>,
}