use std::sync::Arc;

use crate::{application::auth::error::AuthServiceError};
use domain::prelude::*;

pub struct Request {
    pub ident_type: String,
    pub ident_value: String,
}

pub async fn handle(
    req: Request,
    repo: Arc<dyn IAccountRepo>,
    session_repo: Arc<dyn ISessionRepo>,
) -> Result<(), AuthServiceError> {
    let account = repo.find_account_id_by_ident(
        &Identity {
            ident_type: req.ident_type,
            ident_value: req.ident_value,
            id: uuid::Uuid::now_v7(), // 临时 ID
            ident_verified: false,    // 不影响
        }
    )
    .await?;
    let account_id = account.ok_or(AuthServiceError::AccountNotFound)?;
    let mut account = repo.get_account(&account_id).await?
        .ok_or(AuthServiceError::AccountNotFound)?;
    let _ = account.deactivate()?;
    repo.update_account(&account).await?;
    // 直接删掉整个user-session就可以
    session_repo.revoke_user_session(&account_id).await?;
    Ok(())
}
