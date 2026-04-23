use std::sync::Arc;

use crate::{application::auth::error::AuthServiceError, domain::{ar::account::Identity, event::{EventEnvelope, auth::AuthDomainEvent}, repo::account::IAccountRepo, service::verify_code::VerifyCodeService}, infra::{error::InfraError, eventbus::EventBus}};

#[derive(Clone,Debug)]
pub struct ResetCertRequest {
    pub mfa_code: Option<String>,
    pub ident_type: String,
    pub ident_value: String,
    pub cert_type: String,
    pub cert_value: String,
    pub old_value_cert: String,
}

pub async fn handle(
    req: ResetCertRequest,
    account_repo: Arc<dyn IAccountRepo>,
    bus: Arc<dyn EventBus>,
    verify_code_service: Arc<VerifyCodeService>
) -> Result<(), AuthServiceError>{
    let mfa_code = req.mfa_code.ok_or_else(|| AuthServiceError::MfaRequire)?;
    let account_id = account_repo.find_account_id_by_ident(&Identity {
        id: uuid::Uuid::nil(),
        ident_type: req.ident_type.clone(),
        ident_value: req.ident_value.clone(),
        ident_verified: true, // 不重要
    })
        .await?
        .ok_or(AuthServiceError::AccountNotFound)?;
    
    let mut account = account_repo.get_account(&account_id)
        .await?
        .ok_or(AuthServiceError::AccountNotFound)?;
    
    let real_ident = account.find_identity(&req.ident_type)
        .ok_or_else(|| AuthServiceError::IdentNotFound { ident_type: req.ident_type.to_owned() })?;
    if !real_ident.ident_verified {
        return Err(AuthServiceError::UnverifiedIdentifier { iden_type: req.ident_type, ident_value: req.ident_value })
    }
    let pass = verify_code_service.verify_code(&req.ident_value, &mfa_code).await.is_ok();
    if !pass {
        return Err(AuthServiceError::MfaReject)
    }
    let cert = account.find_cert(&req.cert_type)
        .ok_or(AuthServiceError::CertNotFound { cert_type: req.cert_type.clone() })?;
    if !cert.check(&req.cert_type, &req.old_value_cert) {
        return Err(AuthServiceError::CertInconsistent);
    }
    account.update_cert(&req.cert_type, &req.cert_value, &req.old_value_cert)?;
    
    account_repo.update_account(&account).await?;

    bus.publish_auto_try(
        crate::domain::event::DomainEvent::Auth(
            EventEnvelope::new(
                AuthDomainEvent::UpdateCert { account_id }
            )
        ),
        Some(3)
    )
    .map_err(|err| InfraError::EventBusError(err))?;

    Ok(())
}