use std::sync::Arc;

use infra::eventbus::EventBus;
use crate::auth::error::AuthServiceError;
use infra::error::InfraError::VerifyCodeServiceError;
use domain::prelude::*;

#[derive(Clone)]
pub struct ResetCertRequest {
    pub mfa_code: String,
    pub ident_type: String,
    pub ident_value: String,
    pub cert_type: String,
    pub cert_value: String,
}

/// 处理凭证重置请求
///
/// # 参数
/// * `req` - 重置凭证请求，包含验证码、身份标识符和新凭证信息
/// * `account_repo` - 账户存储库，用于查询和更新账户信息
/// * `bus` - 事件总线，用于发布凭证更新事件
/// * `verify_code_service` - 验证码服务，用于验证多因素认证码
///
/// # 返回
/// * `Ok(())` - 凭证重置成功
/// * `Err(AuthServiceError)` - 凭证重置失败，可能的原因包括：
///   - 验证码错误或过期
///   - 账户不存在
///   - 凭证类型不存在
///   - 数据库操作失败
///
pub async fn handle(
    req: &ResetCertRequest,
    account_repo: Arc<dyn IAccountRepo>,
    bus: Arc<dyn EventBus>,
    verify_code_service: Arc<dyn IVerifyCodeService + Send + Sync>,
) -> Result<(), AuthServiceError>{
    let mfa = &req.mfa_code;
    verify_code_service.verify_code(
        &req.ident_type, &mfa
    )
        .await
        .map_err(|err| {
            return AuthServiceError::InfraError(VerifyCodeServiceError(err))
        })?;
    let account_id = account_repo.find_account_id_by_ident(
        &Identity {
            id: uuid::Uuid::nil(),
            ident_type: req.ident_type.clone(),
            ident_value: req.ident_value.clone(),
            ident_verified: true,
        },
    )
    .await?
    .ok_or_else(||AuthServiceError::AccountNotFound)?;
    let mut account = account_repo.get_account(&account_id).await?
        .ok_or_else(||AuthServiceError::AccountNotFound)?;
    let cert_type = req.cert_type.clone();
    let old_cert = account.find_cert(&cert_type)
        .ok_or_else(|| AuthServiceError::CertNotFound { cert_type: cert_type.clone() })?;
    account.remove_cert(&old_cert);
    let cert = Cert::try_new(cert_type, req.cert_value.clone())?;
    account.add_cert(cert);
    account_repo.update_account(&account)
        .await?;
    let event = DomainEvent::Auth(
        EventEnvelope::new(
            AuthDomainEvent::UpdateCert { account_id }
        )
    );
    tokio::spawn(async move {
        let _ = bus.publish(event);
    });
    Ok(())
}