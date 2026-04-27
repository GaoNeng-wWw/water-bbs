use crate::error::IntoApiError;

#[derive(Clone, Debug, thiserror::Error)]
pub enum AuthValidteError {
    #[error("UNSUPPORTED_CERT_TYPE")]
    UnsupportedCertType
}

impl IntoApiError for AuthValidteError {
    fn status_code(&self) -> u16 {
        400
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        None
    }
}