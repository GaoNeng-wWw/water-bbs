use domain::prelude::*;

pub mod mail_sender;

#[async_trait::async_trait]
#[mockall::automock]
pub trait NotificationSender: Send + Sync {
    fn supports(&self, channel: &Channel) -> bool;
    async fn send(&self, event: VerificationCodeSentEvent) -> Result<(), VerifyCodeServiceError>;
}