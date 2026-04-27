use async_trait::async_trait;
use uuid::Uuid;

use crate::{ar::auth_session::AuthSession, error::repo::RepositoryError};

#[async_trait]
#[mockall::automock]
pub trait SessionRepository {
    // 存储新生成的 RT
    async fn save_session(&self, session: &AuthSession) -> Result<(), RepositoryError>;
    
    // 通过 RT ID 查找 (刷新)
    async fn find_session(&self, jti: &Uuid) -> Result<Option<AuthSession>, RepositoryError>;
    
    // 删除单个 Session (退出登录)
    async fn delete_session(&self, jti: &Uuid) -> Result<(), RepositoryError>;
    
    // 删除该账号所有 Session (强制下线)
    async fn delete_all_sessions_for_account(&self, account_id: &Uuid) -> Result<(), RepositoryError>;
}