use std::sync::Arc;

use derive_builder::Builder;
use serde::Deserialize;
use uuid::Uuid;

use crate::{application::auth::error::AuthServiceError, domain::{ar::account::Identity, repo::account::IAccountRepo, service::verify_code::IVerifyCodeService}};

#[derive(Clone, Debug, Deserialize, Builder)]
pub struct VerifyIdentRequest {
    pub mfa_code: String,
    pub ident_type: String,
    pub ident_value: String,
}

pub async fn handle(
    req: &VerifyIdentRequest,
    account_repo: Arc<dyn IAccountRepo>,
    verify_service: Arc<dyn IVerifyCodeService + Send + Sync>,
) -> Result<(), AuthServiceError>{
    let account_id = account_repo.find_account_id_by_ident(&Identity {
        id: Uuid::nil(),
        ident_type: req.ident_type.to_owned(),
        ident_value: req.ident_value.to_owned(),
        ident_verified: false,
    })
        .await?
        .ok_or_else(|| AuthServiceError::AccountNotFound)?;
    let mut account = account_repo.get_account(&account_id)
        .await?
        .ok_or_else(|| AuthServiceError::AccountNotFound)?;
    if !verify_service.verify_code(&req.ident_type, &req.mfa_code).await.is_ok() {
        return Err(AuthServiceError::MfaReject);
    }
    let ident = account.find_identity(&req.ident_type)
        .ok_or_else(|| AuthServiceError::IdentNotFound { ident_type: req.ident_type.clone() })?;
    account.update_identity(&req.ident_type, &req.ident_value);
    account.approve_identity(&ident.id)
        .map_err(|_| AuthServiceError::IdentNotFound { ident_type: req.ident_type.clone() })?;
    account_repo.update_account(&account).await?;
    Ok(())
}