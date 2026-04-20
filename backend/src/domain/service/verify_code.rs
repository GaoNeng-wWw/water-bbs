#[derive(Clone)]
pub struct VerifyCode {
    pub code: String,
    pub target: String,
    pub expires_at: chrono::DateTime<chrono::Utc>,
}

impl VerifyCode {
    pub fn new(code: String, target: String, expires_at: Option<chrono::DateTime<chrono::Utc>>) -> Self {
        Self {
            code,
            target,
            expires_at: expires_at.unwrap_or(chrono::Utc::now() + chrono::Duration::minutes(5))
        }
    }
}

#[derive(Debug, thiserror::Error)]
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

#[async_trait::async_trait]
pub trait IVerifyCodeService {
    async fn verify(&self, code: &str, target: &str) -> Result<(), VerifyCodeServiceError>;
    async fn put(&self, code: &VerifyCode) -> Result<(), VerifyCodeServiceError>;
}