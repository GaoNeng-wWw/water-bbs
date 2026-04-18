use chrono::{DateTime, Utc};

use crate::{domain::{ar::account::Account, error::repo::RepositoryError, vo::account_id::AccountId}, shared::pagination::{CursorPaginationRequest, CursorPaginationResponse}};


#[async_trait::async_trait]
pub trait IAccountRepo {
    async fn get_account(&self, account_id: &AccountId) -> Result<Option<Account>, RepositoryError>;
    async fn create_account(&self, account: &Account) -> Result<(), RepositoryError>;
    async fn update_account(&self, account: &Account) -> Result<(), RepositoryError>;
    async fn delete_account(&self, account_id: &AccountId) -> Result<(), RepositoryError>;
    async fn get_all_accounts(&mut self, pagination: &CursorPaginationRequest<DateTime<Utc>, u64>) -> Result<CursorPaginationResponse<Account, String, u64>, RepositoryError>;
    async fn get_account_count(&mut self) -> Result<u64, RepositoryError>;
}