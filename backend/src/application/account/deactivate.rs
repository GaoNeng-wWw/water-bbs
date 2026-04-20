use std::sync::Arc;

use crate::{application::account::error::AccountServiceError, domain::{ar::account::Identity, repo::account::IAccountRepo}};

pub struct Request {
    pub ident_type: String,
    pub ident_value: String,
}

pub async fn handle(
    req: Request,
    repo: Arc<dyn IAccountRepo>
) -> Result<(), AccountServiceError> {
    let account = repo.find_account_id_by_ident(
        &Identity {
            ident_type: req.ident_type,
            ident_value: req.ident_value,
            id: uuid::Uuid::now_v7(), // 临时 ID
            ident_verified: false,    // 不影响
        }
    )
    .await?;
    if account.is_none() {
        return Err(AccountServiceError::AccountNotFound);
    }
    let account_id = account.unwrap();
    // 一定存在, 不然account_id是怎么找到的
    let mut account = repo.get_account(&account_id).await?.unwrap();
    let _ = account.deactivate()?;
    repo.update_account(&account).await?;
    Ok(())
}
