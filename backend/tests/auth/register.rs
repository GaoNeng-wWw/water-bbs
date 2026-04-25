use std::sync::Arc;

use crate::shared;
use axum::Router;
use axum_test::TestServer;
use backend::{application::auth::registor::MockRegistor, domain::{config::features::{Features, MockIFeaturePolicyProvider}, repo::account::MockIAccountRepo, service::verify_code::MockIVerifyCodeService}, intf::http::auth::handlers::register::RegisterDTO};


#[tokio::test]
async fn test_register_with_captcha() {
    let mut policy_provider= MockIFeaturePolicyProvider::new();
    let mut account_repo = MockIAccountRepo::new();
    let mut verify_code = MockIVerifyCodeService::new();
    verify_code
    .expect_verify_code()
    .returning(|_,_| Box::pin(async {
        Ok(())
    }));
    let mut registor = MockRegistor::new();
    registor
        .expect_validate()
        .returning(|_| Box::pin(async {true}));
    registor
        .expect_perform_registration()
        .returning(|_,_| Box::pin(async {Ok(())}));

    account_repo
        .expect_find_account_id_by_ident()
        .returning(|_| Box::pin(async {
            Ok(None)
        }));
    account_repo.expect_create_account()
        .returning(|_| Box::pin(async {
            Ok(())
        }));

    policy_provider
        .expect_get_features()
        .returning(|| Box::pin(async {
            Ok(Features {
                enable_invite: false,
                enable_register_captcha: true
            })
        }));

    let ctx = shared::MockContextBuilder::default()
        .account_repo(Arc::new(account_repo))
        .policy_provider(Arc::new(policy_provider))
        .verify_code_service(Arc::new(verify_code))
        .strategy(vec![Arc::new(registor)])
        .build()
        .unwrap();

    let state = ctx.to_state().await;
    let router = Router::new()
        .nest("/auth", backend::intf::http::auth::route())
        .with_state(state);
    let server = TestServer::new(router);

    let resp = server.post("/auth/register").json(&RegisterDTO {
        identifier_type: "email".to_string(),
        identifier_value: "test@example.com".to_string(),
        cert_type: "password".to_string(),
        cert_value: "test".to_string(),
        username: "test".to_string(),
        invite_code: None,
        captcha: Some("1234".to_string()),
    });

    let resp = resp.await;

    resp.assert_status_success();
}


#[tokio::test]
async fn test_register_without_invite_and_captcha() {
    let mut policy_provider= MockIFeaturePolicyProvider::new();
    let mut account_repo = MockIAccountRepo::new();

    account_repo
        .expect_find_account_id_by_ident()
        .returning(|_| Box::pin(async {
            Ok(None)
        }));
    account_repo.expect_create_account()
        .returning(|_| Box::pin(async {
            Ok(())
        }));

    policy_provider
        .expect_get_features()
        .returning(|| Box::pin(async {
            Ok(Features {
                enable_invite: false,
                enable_register_captcha: false
            })
        }));

    let mut registor = MockRegistor::new();
    registor
        .expect_validate()
        .returning(|_| Box::pin(async {true}));
    registor
        .expect_perform_registration()
        .returning(|_,_| Box::pin(async {Ok(())}));
    let ctx = shared::MockContextBuilder::default()
        .account_repo(Arc::new(account_repo))
        .policy_provider(Arc::new(policy_provider))
        .strategy(vec![Arc::new(registor)])
        .build()
        .unwrap();

    let state = ctx.to_state().await;
    let router = Router::new()
        .nest("/auth", backend::intf::http::auth::route())
        .with_state(state);
    let server = TestServer::new(router);

    let resp = server.post("/auth/register").json(&RegisterDTO {
        identifier_type: "email".to_string(),
        identifier_value: "test@example.com".to_string(),
        cert_type: "password".to_string(),
        cert_value: "test".to_string(),
        username: "test".to_string(),
        invite_code: None,
        captcha: None,
    });

    let resp = resp.await;

    resp.assert_status_success();
}
