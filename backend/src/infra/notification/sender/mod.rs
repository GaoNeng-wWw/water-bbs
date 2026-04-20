use crate::domain::{event::verification_code_sent_event::VerificationCodeSentEvent, service::verify_code::{Channel, VerifyCodeServiceError}};

pub mod mail_sender;

#[async_trait::async_trait]
pub trait NotificationSender: Send + Sync {
    fn supports(&self, channel: &Channel) -> bool;
    async fn send(&self, event: VerificationCodeSentEvent) -> Result<(), VerifyCodeServiceError>;
}