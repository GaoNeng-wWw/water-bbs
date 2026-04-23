use std::sync::Arc;

use crate::{application::auth::error::AuthServiceError, domain::service::verify_code::{Channel, VerifyCodeService}, infra::error::InfraError, shared};

#[derive(Clone, Debug)]
pub struct RequestCodeRequest {
    pub ident_type: String,
    pub ident_value: String,
}

pub async fn handle(
    req: &RequestCodeRequest,
    verify_code: Arc<VerifyCodeService>
) -> Result<(),AuthServiceError>{
    let channel = match req.ident_type.as_ref() {
        "email" | "Email" | "Mail" | "mail" => {
            Ok(Channel::Email)
        }
        _ => Err(AuthServiceError::UnsupportedIdentType { ident_type: req.ident_type.clone() })
    }?;
    let code = shared::random::generator::digital(8);
    verify_code.send_code(channel, &req.ident_value, &code)
        .await
        .map_err(|err| InfraError::VerifyCodeServiceError(err))?;
    Ok(())
}