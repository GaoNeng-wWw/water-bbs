use serde::{Deserialize, Serialize};

use domain::prelude::*;

#[derive(Clone, Debug, Deserialize, Serialize, thiserror::Error)]
pub enum EventBusError {
    #[error("SEND_FAIL")]
    SendFail { event: DomainEvent, retires: usize },
}

impl IntoApiError for EventBusError {
    fn status_code(&self) -> u16 {
        500
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            EventBusError::SendFail { event, retires } => Some(serde_json::json!(self)),
        }
    }
}