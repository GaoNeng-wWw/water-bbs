use fred::prelude::{KeysInterface, Pool};

use crate::domain::{config::loader::Loader, error::config::ConfigLoaderError};

#[derive(Clone)]
pub struct RedisConfigLoader {
    pub redis: Pool
}

impl RedisConfigLoader {
    pub fn new(redis: Pool) -> Self {
        Self { redis }
    }
}

#[async_trait::async_trait]
impl Loader for RedisConfigLoader {
    async fn put<T: serde::ser::Serialize + Sync>(&self, path:&str, value: &T) -> Result<(), ConfigLoaderError> {
        let value = serde_json::to_string(value)
        .map_err(|err| ConfigLoaderError::InfraError {
            cause: err.to_string(),
        })?;
        let _:() = self.redis.set(format!("config:{}", path), value, None, None, false).await
        .map_err(|err| ConfigLoaderError::InfraError {
            cause: err.to_string(),
        })?;
        Ok(())
    }
    async fn load<T: serde::de::DeserializeOwned + Sync>(&self, path: &str) -> Result<Option<T>, ConfigLoaderError> {
        let value: String = self.redis.get(format!("config:{}", path)).await
        .map_err(|err| ConfigLoaderError::InfraError {
            cause: err.to_string(),
        })?;
        let config = serde_json::from_str::<T>(&value)
        .map_err(|err| ConfigLoaderError::InfraError {
            cause: err.to_string(),
        })?;
        Ok(Some(config))
    }
}