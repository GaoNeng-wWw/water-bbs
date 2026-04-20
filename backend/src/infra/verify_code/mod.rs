use std::sync::Arc;

use chrono::Timelike;
use fred::{prelude::{KeysInterface, Pool}, types::Expiration};

use crate::domain::service::verify_code::{IVerifyCodeService, VerifyCode, VerifyCodeServiceError};

pub struct VerifyCodeService {
    pub redis: Arc<Pool>
}

impl VerifyCodeService {
    pub fn new(redis: Arc<Pool>) -> Self {
        Self { redis }
    }
}

#[async_trait::async_trait]
impl IVerifyCodeService for VerifyCodeService {
    async fn verify(&self, code: &str, target: &str) -> Result<(), VerifyCodeServiceError> {
        let code = code.to_string();
        let key = format!("verify-code:{}:{}", target, code);
        let real_target: Option<String> = self.redis.getdel(&key)
            .await
            .map_err(|_| VerifyCodeServiceError::InfraError)?;
        match real_target {
            Some(t) if t == target => Ok(()),
            _ => Err(VerifyCodeServiceError::VerifyFailed),
        }
    }
    async fn put(&self, code: &VerifyCode) -> Result<(), VerifyCodeServiceError> {
        let code_value = code.code.clone();
        let target = code.target.clone();
        let expires_at = code.expires_at.timestamp();
        let _:() = self.redis.set(format!("verify-code:{}:{}", target, code_value), &target, Some(Expiration::EXAT(expires_at as i64)), None, false)
            .await
            .map_err(|_| VerifyCodeServiceError::InfraError)?;
        Ok(())
    }
}