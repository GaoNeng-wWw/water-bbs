use serde::{Deserialize, Serialize};

use crate::vo::account_id::AccountId;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum AuthDomainEvent {
    UpdateCert { account_id: AccountId }
}