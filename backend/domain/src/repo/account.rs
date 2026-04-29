use chrono::{DateTime, Utc};
use shared::pagination::{CursorPaginationRequest, CursorPaginationResponse};

use crate::{ar::account::{Account, Identity}, error::repo::RepositoryError, prelude::Profile, vo::account_id::AccountId};


#[async_trait::async_trait]
#[mockall::automock]
pub trait IAccountRepo: Send + Sync {
    async fn incr(&self) -> Result<(), RepositoryError>;
    async fn decr(&self) -> Result<(), RepositoryError>;
    async fn find_account_id_by_ident(&self, identity: &Identity) -> Result<Option<AccountId>, RepositoryError>;
    async fn get_account(&self, account_id: &AccountId) -> Result<Option<Account>, RepositoryError>;
    async fn create_account(&self, account: &Account) -> Result<(), RepositoryError>;
    async fn update_account(&self, account: &Account) -> Result<(), RepositoryError>;
    async fn delete_account(&self, account_id: &AccountId) -> Result<(), RepositoryError>;
    async fn get_all_accounts(&mut self, pagination: &CursorPaginationRequest<DateTime<Utc>, u64>) -> Result<CursorPaginationResponse<Account, DateTime<Utc>, u64>, RepositoryError>;
    async fn get_account_count(&mut self) -> Result<i64, RepositoryError>;
}