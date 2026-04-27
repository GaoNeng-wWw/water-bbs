use serde::{Deserialize, Serialize};

use crate::eventbus::error::EventBusError;
use domain::prelude::*;

#[derive(Clone, Debug, Deserialize, Serialize, thiserror::Error)]
pub enum InfraError {
    #[error(transparent)]
    EventBusError(#[from] EventBusError),
    #[error(transparent)]
    VerifyCodeServiceError(#[from] VerifyCodeServiceError)
}

impl IntoApiError for InfraError {
    fn status_code(&self) -> u16 {
        match self {
            InfraError::EventBusError(event_bus_error) => event_bus_error.status_code(),
            InfraError::VerifyCodeServiceError(verify_code_service_error) => verify_code_service_error.status_code(),
                    }
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            InfraError::EventBusError(event_bus_error) => event_bus_error.cause(),
            InfraError::VerifyCodeServiceError(verify_code_service_error) => verify_code_service_error.cause(),
                    }
    }
}