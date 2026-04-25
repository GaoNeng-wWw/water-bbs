use std::{sync::Arc, time::Duration};

use backend::{application::auth::registor::Registor, intf::http::ext::state::AppState};
use derive_builder::Builder;
use fred::{
    prelude::{Config, Pool, TcpConfig},
    types::Builder,
};

use backend::{
    domain::{
        config::features::MockIFeaturePolicyProvider,
        repo::{account::MockIAccountRepo, session::MockISessionRepo},
        service::{token::MockITokenService, verify_code::MockIVerifyCodeService},
    },
    infra::eventbus::MockEventBus,
};

pub async fn create_redis() -> Pool {
    let cfg = Config {
        mocks: Some(Arc::new(fred::mocks::Echo)),
        ..Default::default()
    };

    let client = Builder::from_config(cfg)
        .with_connection_config(|config| {
            config.connection_timeout = Duration::from_secs(5);
            config.tcp = TcpConfig {
                nodelay: Some(true),
                ..Default::default()
            };
        })
        .build_pool(5)
        .unwrap();
    client
}

#[derive(Builder)]
pub struct MockContext {
    #[builder(default=Arc::new(MockIAccountRepo::new()))]
    pub account_repo: Arc<MockIAccountRepo>,
    #[builder(default=Arc::new(MockISessionRepo::new()))]
    pub session_repo: Arc<MockISessionRepo>,
    #[builder(default=Arc::new(MockEventBus::new()))]
    pub event_bus: Arc<MockEventBus>,
    #[builder(default=Arc::new(MockIFeaturePolicyProvider::new()))]
    pub policy_provider: Arc<MockIFeaturePolicyProvider>,
    #[builder(default=Arc::new(MockIVerifyCodeService::new()))]
    pub verify_code_service: Arc<MockIVerifyCodeService>,
    #[builder(default=Arc::new(MockITokenService::new()))]
    pub token_service: Arc<MockITokenService>,
    pub strategy: Vec<Arc<dyn Registor + Send + Sync>>,
}

impl MockContext {
    pub async fn to_state(&self) -> AppState{
        AppState { 
            account_repo: self.account_repo.clone(),
            session_repo: self.session_repo.clone(),
            event_bus: self.event_bus.clone(),
            policy_provider: self.policy_provider.clone(),
            verify_code_service: self.verify_code_service.clone(),
            token_service: self.token_service.clone(),
            jwk: Arc::new(josekit::jwk::Jwk::generate_rsa_key(4096).unwrap()),
            redis: Arc::new(create_redis().await),
            strategy: self.strategy.clone(),
        }
    }
}