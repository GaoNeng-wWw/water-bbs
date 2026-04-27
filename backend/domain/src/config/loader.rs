use crate::error::config::ConfigLoaderError;

#[async_trait::async_trait]
pub trait Loader {
    /// 加载配置
    /// 使用 . 分隔路径
    async fn load<T: serde::de::DeserializeOwned + Sync>(&self, path: &str) -> Result<Option<T>, ConfigLoaderError>;
    /// 存储所有配置
    async fn put<T: serde::ser::Serialize + Sync>(&self, path: &str, value: &T) -> Result<(), ConfigLoaderError>;
}
