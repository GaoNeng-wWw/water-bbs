use std::sync::Arc;

use crate::domain::{config::{features::{Features, IFeaturePolicyProvider}, loader::Loader}, error::config::PolicyError};

pub struct RedisFeaturesProvider<L: Loader + Send + Sync + 'static> {
    pub loader: Arc<L>,
}

impl<L: Loader + Send + Sync + 'static> RedisFeaturesProvider<L> {
    pub fn new(loader: Arc<L>) -> Self {
        Self { loader }
    }
}

#[async_trait::async_trait]
impl<L: Loader + Send + Sync + 'static> IFeaturePolicyProvider for RedisFeaturesProvider<L> {
    async fn get_features(&self) -> Result<Features, PolicyError> {
        let features = self.loader.load::<Features>("features").await?
        .unwrap_or_default();
        Ok(features)
    }
    async fn put_features(&self, features: &Features) -> Result<(), PolicyError> {
        self.loader.put("features", features).await?;
        Ok(())
    }
}