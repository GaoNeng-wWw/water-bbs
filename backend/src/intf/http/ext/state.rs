use std::sync::Arc;

use infra::eventbus::EventBus;
use application::auth::registor::Registor;
use domain::{config::features::IFeaturePolicyProvider, prelude::{IPostRepo, query::error::QueryError}, repo::{account::IAccountRepo, session::ISessionRepo, tag::ITagRepo}, service::{token::ITokenService, verify_code::{IVerifyCodeService, VerifyCodeService}}};

#[derive(Clone)]
pub struct CQRSState {
    pub fetch_profile: Arc<
        dyn cqrs::query::Query<
            Result = cqrs::query::fetch_profile::FetchProfileResult,
            Error = QueryError,
            Query = cqrs::query::fetch_profile::FetchProfileQuery,
        > + Send + Sync,
    >,
}

#[derive(Clone)]
pub struct AppState {
    pub account_repo: Arc<dyn IAccountRepo + Send + Sync>,
    pub session_repo: Arc<dyn ISessionRepo + Send + Sync>,
    pub post_repo: Arc<dyn IPostRepo + Send + Sync>,
    pub tag_repo: Arc<dyn ITagRepo + Send + Sync>,
    pub event_bus: Arc<dyn EventBus + Send + Sync>,
    pub redis: Arc<fred::prelude::Pool>,
    pub policy_provider: Arc<dyn IFeaturePolicyProvider + Send + Sync>,
    pub verify_code_service: Arc<dyn IVerifyCodeService + Send + Sync>,
    pub token_service: Arc<dyn ITokenService + Send + Sync>,
    pub strategy: Vec<Arc<dyn Registor + Send + Sync>>,
    pub jwk: Arc<josekit::jwk::Jwk>,
    pub cqrs_state: CQRSState,
}