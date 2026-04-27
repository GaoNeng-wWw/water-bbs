use fred::prelude::{KeysInterface, Pool};
// use fred::prelude::{KeysInterface, Pool};
use serde::{Deserialize, Serialize};

use crate::{error::IntoApiError, event::verification_code_sent_event::VerificationCodeSentEvent};

#[derive(Clone, Debug)]
pub struct VerifyCode {
    pub code: String,
    pub target: String,
    pub expires_at: chrono::DateTime<chrono::Utc>,
    pub channel: Channel,
}

impl VerifyCode {
    pub fn new(code: String, target: String, channel: Channel, expires_at: Option<chrono::DateTime<chrono::Utc>>,) -> Self {
        Self {
            code,
            target,
            expires_at: expires_at.unwrap_or(chrono::Utc::now() + chrono::Duration::minutes(5)),
            channel,
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize, thiserror::Error)]
pub enum VerifyCodeServiceError {
    #[error("INVALID_CODE")]
    InvalidCode,
    #[error("INVALID_TARGET")]
    InvalidTarget,
    #[error("SEND_FAILED")]
    SendFailed,
    #[error("VERIFY_FAILED")]
    VerifyFailed,
    #[error("INFRA_ERROR")]
    InfraError,
}

impl IntoApiError for VerifyCodeServiceError {
    fn status_code(&self) -> u16 {
        500
    }
    fn message(&self) -> String {
        self.to_string()
    }
    fn cause(&self) -> Option<serde_json::Value> {
        None
    }
}

#[async_trait::async_trait]
#[mockall::automock]
pub trait IVerifyCodeService {
    async fn send_code(&self,channel: Channel,target: &str,code: &str) -> Result<(), VerifyCodeServiceError>;
    async fn verify_code(&self, target: &str, code: &str) -> Result<(), VerifyCodeServiceError>;
}

#[derive(Clone, Debug)]
pub struct VerifyCodeService {
    tx: tokio::sync::broadcast::Sender<VerificationCodeSentEvent>,
    redis: Pool
}

impl VerifyCodeService {
    pub fn new(tx: tokio::sync::broadcast::Sender<VerificationCodeSentEvent>, redis: Pool) -> Self {
        Self { tx, redis }
    }
}

#[derive(Clone, Debug)]
pub enum Channel {
    Email,
}

// TODO: 移动到infra

#[async_trait::async_trait]
impl IVerifyCodeService for VerifyCodeService {
    
    // 发布验证码
    // 通过指定频道
    async fn send_code(
        &self,
        channel: Channel,
        target: &str,
        code: &str
    ) -> Result<(), VerifyCodeServiceError> {
        let code = VerifyCode::new(code.to_string(), target.to_string(), channel.clone(),None);

        let _:() = self.redis.set(
            format!("verify_code:{}:{}", code.target,code.code),
            &code.target,
            Some(fred::types::Expiration::EXAT(code.expires_at.timestamp())),
            None,
            false
        )
        .await
        .map_err(|_| VerifyCodeServiceError::InfraError)?;


        self.tx.send(
            VerificationCodeSentEvent {
                code,
                channel,
                target: target.to_string(),
            }
        ).map_err(|_| VerifyCodeServiceError::InfraError)?;

        Ok(())
    }
    async fn verify_code(&self, target: &str, code: &str) -> Result<(), VerifyCodeServiceError> {
        let stored_code:Option<String> = self.redis.get(format!("verify_code:{}:{}", target, code))
        .await
        .map_err(|_| VerifyCodeServiceError::InfraError)?;
        if stored_code.is_none() {
            return Err(VerifyCodeServiceError::InvalidCode);
        }
        if stored_code.unwrap() != code {
            return Err(VerifyCodeServiceError::InvalidCode);
        }
        Ok(())
    }
}
