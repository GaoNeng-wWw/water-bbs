use serde::{Deserialize, Serialize};

use crate::{domain::error::IntoApiError, infra::eventbus::error::EventBusError};

#[derive(Clone, Debug, Deserialize, Serialize, thiserror::Error)]
pub enum InfraError {
    #[error(transparent)]
    EventBusError(#[from] EventBusError)
}

impl IntoApiError for InfraError {
    fn status_code(&self) -> u16 {
        match self {
            InfraError::EventBusError(event_bus_error) => event_bus_error.status_code(),
        }
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            InfraError::EventBusError(event_bus_error) => event_bus_error.cause(),
        }
    }
}