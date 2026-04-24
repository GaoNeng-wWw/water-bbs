use std::sync::Arc;

use derive_builder::Builder;

use crate::{
    application::auth::{
        error::AuthServiceError,
        registor::{RegisterRequest, Registor, RegistorContext},
    },
    domain::{
        config::features::IFeaturePolicyProvider,
        repo::account::IAccountRepo,
        service::verify_code::VerifyCodeService,
    },
};

#[derive(Clone, Builder)]
pub struct Request {
    pub username: String,
    pub ident_type: String,
    pub ident_value: String,
    pub cert_type: String,
    pub cert_value: String,
    #[builder(default=None)]
    pub invite_code: Option<String>,
    #[builder(default=None)]
    pub captcha: Option<String>,
}

pub async fn handle(
    req: Request,
    strategies: Vec<Arc<dyn Registor + Send + Sync>>,
    repo: Arc<dyn IAccountRepo + Send + Sync>,
    verify_code: Arc<VerifyCodeService>,
    policy_provider: Arc<dyn IFeaturePolicyProvider + Send + Sync>,
) -> Result<(), AuthServiceError> {
    let features = policy_provider.get_features().await?;

    if !features.can_register(req.invite_code.as_deref(), req.captcha.as_deref()) {
        if features.enable_register_captcha && !req.captcha.is_some() {
            return Err(AuthServiceError::CaptchaRequire);
        }
        if features.enable_invite && !req.invite_code.is_some() {
            return Err(AuthServiceError::InviteCodeRequire);
        }
    }

    let context = RegistorContext {
        repo,
        verify_code,
        policy_provider,
    };
    let req = RegisterRequest {
        ident_type: req.ident_type,
        ident_value: req.ident_value,
        cert_type: req.cert_type,
        cert_value: req.cert_value,
        name: req.username,
    };
    let mut ok = false;
    for strategy in strategies {
        if strategy.validate(&req.ident_type).await {
            let _ = strategy.perform_registration(&req, &context).await?;
            ok = true;
            break;
        }
    }
    if !ok {
        return Err(AuthServiceError::UnsupportedIdentType { ident_type: req.ident_type });
    }

    Ok(())
}
