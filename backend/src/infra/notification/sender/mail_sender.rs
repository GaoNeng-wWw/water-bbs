use lettre::{Message, SmtpTransport, Transport, message::header::ContentType};

use crate::{
    domain::{
        event::verification_code_sent_event::VerificationCodeSentEvent,
        service::verify_code::{Channel, VerifyCodeServiceError},
    },
    infra::notification::sender::NotificationSender,
};

#[derive(Clone)]
pub struct MailSender {
    smtp_client: SmtpTransport,
}

impl MailSender {
    pub fn new(smtp_client: SmtpTransport) -> Self {
        Self { smtp_client }
    }
}

#[async_trait::async_trait]
impl NotificationSender for MailSender {
    fn supports(&self, channel: &Channel) -> bool {
        matches!(channel, Channel::Email)
    }

    async fn send(&self, event: VerificationCodeSentEvent) -> Result<(), VerifyCodeServiceError> {
        let email = Message::builder()
            .from("Water BBS <support@water-bbs.org>".parse().unwrap())
            .to(event.target.parse().unwrap())
            .subject("验证码通知")
            .header(ContentType::TEXT_PLAIN)
            .body(format!("您的验证码为{}, 请妥善保管", event.code.code))
            .unwrap();
        let _ = self.smtp_client.send(&email)
            .map_err(|err| {
                VerifyCodeServiceError::SendFailed
            })?;
        Ok(())
    }
}
