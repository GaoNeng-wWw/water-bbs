use std::sync::Arc;

use crate::{application::account::error::AccountServiceError, domain::{ar::account::Identity, repo::account::IAccountRepo}};

#[derive(Clone, Debug)]
pub struct LoginRequest {
    pub ident_type:String,
    pub ident_value:String,
    pub cert_type:String,
    pub cert_value:String,
}

pub async fn handler(
    req: &LoginRequest,
    repo: Arc<dyn IAccountRepo>
) -> Result<(), AccountServiceError> {
    let account = repo.find_account_id_by_ident(
        &Identity {
            id: uuid::Uuid::now_v7(),
            ident_type: req.ident_type.clone(),
            ident_value: req.ident_value.clone(),
            ident_verified: true,
        }
    )
    .await
    .map_err(|err| {
        AccountServiceError::RepoError(err)
    })?;
    if account.is_none() {
        return Err(AccountServiceError::AccountNotFound)
    }
    let account_id = account.unwrap();
    let account = repo.get_account(&account_id).await
        .map_err(|err| {
        AccountServiceError::RepoError(err)
    })?;
    if account.is_none() {
        return Err(AccountServiceError::AccountNotFound)
    }
    let account = account.unwrap();
    Ok(())
    
}