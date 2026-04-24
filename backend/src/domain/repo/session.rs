use crate::domain::{ar::auth_session::{AuthSession, UserSession}, error::repo::RepositoryError, vo::{account_id::AccountId, session::SessionId}};


#[async_trait::async_trait]
#[mockall::automock]
pub trait ISessionRepo {
    async fn upsert(&self, session: &UserSession) -> Result<SessionId, RepositoryError>;
    async fn revoke(&self, account_id: &AccountId, session_id: &SessionId) -> Result<Option<AuthSession>, RepositoryError>;
    async fn find_session(&self, account_id: &AccountId) -> Result<Option<UserSession>, RepositoryError>;
}