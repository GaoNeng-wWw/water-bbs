use std::sync::Arc;

use josekit::jwk::Jwk;

use crate::{application::auth::error::AuthServiceError, infra::eventbus::EventBus};

use domain::prelude::*;

#[derive(Clone,Debug)]
pub struct UpdateCertRequest {
    pub ident_type: String,
    pub ident_value: String,
    pub mfa_code: String,
    pub token: String,
    pub cert_type: String,
    pub cert_value: String,
    pub old_cert_value: String,
}

pub async fn handle(
    req: UpdateCertRequest,
    jwk: Arc<Jwk>,
    account_repo: Arc<dyn IAccountRepo>,
    bus: Arc<dyn EventBus>,
    token_service: Arc<dyn ITokenService + Send + Sync>,
    verify_code_service: Arc<dyn IVerifyCodeService + Send + Sync>,
) -> Result<(), AuthServiceError>{
    let token = token_service.verify_token(&req.token, &jwk)?;
    let account_id = token.sub;
    let account = account_repo.get_account(&account_id).await?;
    if account.is_none() {
        return Err(AuthServiceError::AccountNotFound)
    }
    let mut account = account.unwrap();
    let ident = account.find_identity(&req.ident_type)
        .ok_or_else(|| AuthServiceError::IdentNotFound { ident_type: req.ident_type.clone() })?;
    
    if !ident.ident_verified {
        return Err(AuthServiceError::UnverifiedIdentifier { iden_type: req.ident_type.clone(), ident_value: req.ident_value.clone() })
    }
    let cert = account.find_cert(&req.cert_type)
        .ok_or_else(|| AuthServiceError::CertNotFound { cert_type: req.cert_type.clone() })?;

    if !cert.check(&req.old_cert_value)? {
        return Err(AuthServiceError::CertInconsistent);
    }
    
    verify_code_service.verify_code(&req.ident_value, &req.mfa_code).await
        .map_err(|err| {
            return AuthServiceError::InfraError(crate::infra::error::InfraError::VerifyCodeServiceError(err))
        })?;

    
    account.update_cert(&req.cert_type, &req.cert_value, &req.old_cert_value)?;

    let event = DomainEvent::Auth(
        EventEnvelope::new(
            AuthDomainEvent::UpdateCert { account_id }
        )
    );

    let _ = bus.publish(event)
        .map_err(|err| {
            return AuthServiceError::InfraError(crate::infra::error::InfraError::EventBusError(err))
        })?;

    Ok(())
}