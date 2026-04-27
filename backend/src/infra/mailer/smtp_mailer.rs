use lettre::{Message, SmtpTransport, Transport};

use domain::prelude::*;

pub struct SmtpMailer {
    pub smtp_client: SmtpTransport,
}

impl SmtpMailer {
    pub fn new(smtp_client: SmtpTransport) -> Self {
        Self { smtp_client }
    }
}

#[async_trait::async_trait]
impl Mailer for SmtpMailer {
    async fn send(&self, mail: &Mail) -> Result<bool, MailError> {
        let to = mail.to.parse().map_err(|_| MailError::InvalidEmailAddress)?;
        let from = mail.from.parse().map_err(|_| MailError::InvalidEmailAddress)?;
        let msg = Message::builder()
            .to(to)
            .from(from)
            .subject(mail.subject.clone())
            .body(mail.body.clone())
            .unwrap();
        self.smtp_client.send(&msg)
        .map_err(|err| {
            MailError::MailerError { reason: err.to_string() }
        })?;

        Ok(true)
    }
}