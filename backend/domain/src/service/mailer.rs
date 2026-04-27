use serde::Serialize;

use crate::error::IntoApiError;

pub struct Mail {
    pub to: String,
    pub from: String,
    pub subject: String,
    pub body: String,
}
#[derive(Debug, thiserror::Error, Serialize)]
pub enum MailError {
    #[error("MAILER_ERROR")]
    MailerError { reason: String },
    #[error("INVALID_EMAIL_ADDRESS")]
    InvalidEmailAddress,
}

impl IntoApiError for MailError {
    fn status_code(&self) -> u16 {
        match self {
            MailError::MailerError { .. } => 500,
            MailError::InvalidEmailAddress => 400,
        }
    }
    fn message(&self) -> String {
        self.to_string()
    }
    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            MailError::MailerError { reason } => Some(serde_json::json!(self)),
            MailError::InvalidEmailAddress => None,
        }
    }
}

#[async_trait::async_trait]
#[mockall::automock]
pub trait Mailer {
    async fn send(&self, mail: &Mail) -> Result<bool, MailError>;
}