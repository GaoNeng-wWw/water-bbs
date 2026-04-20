use serde::Serialize;

use crate::domain::error::IntoApiError;

#[derive(Debug, thiserror::Error, Clone, Serialize)]
pub enum ConfigError {
    #[error(transparent)]
    LoaderError(#[from] ConfigLoaderError),
}

impl IntoApiError for ConfigError {
    fn status_code(&self) -> u16 {
        match self {
            ConfigError::LoaderError(config_loader_error) => config_loader_error.status_code(),
        }
    }

    fn message(&self) -> String {
        self.to_string()
    }

    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            ConfigError::LoaderError(config_loader_error) => config_loader_error.cause(),
        }
    }
}

#[derive(Debug, thiserror::Error, Clone, Serialize)]
pub enum ConfigLoaderError {
    #[error("INFRA_ERROR")]
    InfraError { cause: String },
}
#[derive(Debug, thiserror::Error, Clone, Serialize)]
pub enum PolicyError{
    #[error("POLICY_ERROR")]
    PolicyError { cause: String },
    #[error(transparent)]
    ConfigError(#[from] ConfigError),
    #[error(transparent)]
    LoaderError(#[from] ConfigLoaderError),
}

impl IntoApiError for ConfigLoaderError {
    fn status_code(&self) -> u16 {
        match self {
            ConfigLoaderError::InfraError { .. } => 500,
        }
    }

    fn message(&self) -> String {
        self.to_string()
    }
    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            ConfigLoaderError::InfraError { .. } => Some(serde_json::json!(self)),
        }
    }
}

impl IntoApiError for PolicyError {
    fn message(&self) -> String {
        self.to_string()
    }
    fn status_code(&self) -> u16 {
        match self {
            PolicyError::PolicyError { .. } => 500,
            PolicyError::ConfigError(config_error) => config_error.status_code(),
            PolicyError::LoaderError(config_loader_error) => config_loader_error.status_code(),
        }
    }
    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            PolicyError::PolicyError { .. } => Some(serde_json::json!(self)),
            PolicyError::ConfigError(config_error) => config_error.cause(),
            PolicyError::LoaderError(config_loader_error) => config_loader_error.cause(),
        }
    }
}