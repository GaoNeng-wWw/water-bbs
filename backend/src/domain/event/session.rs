use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::domain::vo::{account_id::AccountId, session::SessionId};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum SessionDomainEvent {
    SessionRevoked { session_id: SessionId, account_id: AccountId },
}