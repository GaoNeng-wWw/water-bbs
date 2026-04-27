use crate::{
    auth::{
        error::RegistoryError,
        registor::{RegisterRequest, Registor, RegistorContext},
    },
};
use domain::prelude::*;

// 邮箱注册器
pub struct MailRegistor;

#[async_trait::async_trait]
impl Registor for MailRegistor {
    async fn validate(&self, value: &str) -> bool {
        value.to_lowercase() == "email" || value.to_lowercase() == "mail"
    }

    async fn perform_registration(&self, request: &RegisterRequest, context: &RegistorContext) -> Result<(), RegistoryError> {
        let features = context.policy_provider.get_features().await?;
        if features.enable_register_captcha {
            let code = request.meta.get("code");
            if let Some(code_str) = code {
                context.verify_code.verify_code(&request.ident_value, &code_str.to_string()).await?;
            }
        }
        let ident = Identity {
            id: uuid::Uuid::now_v7(),
            ident_type: request.ident_type.clone(),
            ident_value: request.ident_value.clone(),
            ident_verified: !features.enable_register_captcha,
        };
        let account_exists = context.repo.find_account_id_by_ident(&ident).await?.is_some();
        if account_exists {
            return Err(RegistoryError::AccountExists);
        }
        let cert = Cert::try_new(request.cert_type.clone(), request.cert_value.clone())?;
        let profile = Profile {
            id: uuid::Uuid::now_v7(),
            name: request.name.clone(),
            bio: None,
            avatar: None,
        };
        let account = Account {
            id: AccountId::build(),
            money: Money::try_new(0).unwrap(),
            locked_money: Money::try_new(0).unwrap(),
            bd: false,
            identity: vec![ident],
            cert: vec![cert],
            profile,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
            deleted_at: None,
        };
        context.repo.create_account(&account).await?;
        
        Ok(())
    }
}
