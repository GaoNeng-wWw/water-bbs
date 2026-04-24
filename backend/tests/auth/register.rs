use std::sync::Arc;

use josekit::jwk::Jwk;

use fred::prelude::*;

use crate::shared;



#[tokio::test]
async fn test(){
    use backend::{domain::{config::features::MockIFeaturePolicyProvider, repo::{account::MockIAccountRepo, session::MockISessionRepo}, service::{token::MockITokenService, verify_code::MockIVerifyCodeService}}, infra::eventbus::MockEventBus, intf::http::ext::state::AppState};
    let account_repo = MockIAccountRepo::new();
    let session_repo = MockISessionRepo::new();
    let event_bus = MockEventBus::new();
    let policy_provider = MockIFeaturePolicyProvider::new();
    let verify_code_service = MockIVerifyCodeService::new();
    let token_service= MockITokenService::new();
    let jwt = Jwk::generate_rsa_key(4096).unwrap();
    let redis = shared::create_redis().await;
    
    let state = AppState {
        account_repo: Arc::new(account_repo),
        session_repo: Arc::new(session_repo),
        event_bus: Arc::new(event_bus),
        redis: Arc::new(redis),
        policy_provider: Arc::new(policy_provider),
        verify_code_service: Arc::new(verify_code_service),
        token_service: Arc::new(token_service),
        jwk: Arc::new(jwt),
    };

}