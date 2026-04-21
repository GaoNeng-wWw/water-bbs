use std::sync::Arc;

use crate::{domain::{config::features::IFeaturePolicyProvider, repo::account::IAccountRepo, service::verify_code::VerifyCodeService}, infra::eventbus::EventBus};

#[derive(Clone)]
pub struct AppState {
    pub account_repo: Arc<dyn IAccountRepo>,
    pub event_bus: Arc<dyn EventBus>,
    pub redis: Arc<fred::prelude::Pool>,
    pub policy_provider: Arc<dyn IFeaturePolicyProvider + Send + Sync>,
    pub verify_code_service: Arc<VerifyCodeService>,
}