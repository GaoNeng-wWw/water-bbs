use crate::{
    application::account::{
        error::RegistoryError,
        registor::{RegisterRequest, Registor, RegistoryContext},
    },
    domain::{ar::account::{Account, Cert, Identity}, service::{mailer::Mail, verify_code::VerifyCode}, vo::{account_id::AccountId, money::Money, profile::Profile}},
    shared::random::generator,
};

// 邮箱注册器
pub struct MailRegistor;

#[async_trait::async_trait]
impl Registor for MailRegistor {
    async fn validate(&self, value: &str) -> bool {
        value.to_lowercase() == "email" || value.to_lowercase() == "mail"
    }

    async fn perform_registration(
        &self,
        request: &RegisterRequest,
        context: &RegistoryContext,
    ) -> Result<(), RegistoryError> {
        if !context.code_free {
            let code_val = generator::digital(8);
            let code = VerifyCode::new(code_val.clone(), request.ident_value.clone(), None);
            context
                .verify_code
                .put(&code)
                .await
                .map_err(|err| RegistoryError::InfraError {
                    cause: err.to_string(),
                })?;
    
            let mail = Mail {
                to: request.ident_value.clone(),
                // TODO: 从配置中获取
                from: "water-bbs@example.com".to_string(),
                // TODO: 从配置中获取
                subject: format!("邮箱验证码"),
                // TODO: 从配置中获取
                body: format!("验证码为: {}", code_val),
            };
            context.mailer.send(&mail)
                .await
                .map_err(|err| RegistoryError::InfraError {
                    cause: err.to_string(),
                })?;
        }
        let ident = Identity {
            id: uuid::Uuid::now_v7(), ident_type: request.ident_type.clone(), ident_value: request.ident_value.clone(),
            ident_verified: context.code_free
        };
        let account_exists = context.repo.find_account_id_by_ident(&ident).await?.is_some();
        if account_exists {
            return Err(RegistoryError::AccountExists);
        }
        let cert = Cert { id: uuid::Uuid::now_v7(), cert_type: request.cert_type.clone(), cert_value: request.cert_value.clone() };
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
