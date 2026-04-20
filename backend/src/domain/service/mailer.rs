pub struct Mail {
    pub to: String,
    pub from: String,
    pub subject: String,
    pub body: String,
}
#[derive(Debug, thiserror::Error)]
pub enum MailError {
    #[error("MAILER_ERROR")]
    MailerError { reason: String },
    #[error("INVALID_EMAIL_ADDRESS")]
    InvalidEmailAddress,
}

#[async_trait::async_trait]
pub trait Mailer {
    async fn send(&self, mail: &Mail) -> Result<bool, MailError>;
}