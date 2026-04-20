use crate::domain::service::verify_code::{Channel, VerifyCode};

#[derive(Clone, Debug)]
pub struct VerificationCodeSentEvent {
    pub code: VerifyCode,
    pub channel: Channel,
    pub target: String,
}