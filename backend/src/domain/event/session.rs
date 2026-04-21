use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum SessionDomainEvent {
    SessionRevoked { session_id: Uuid },
}