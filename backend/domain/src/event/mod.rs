use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub mod verification_code_sent_event;
pub mod session;
pub mod auth;

pub mod prelude {
    pub use super::verification_code_sent_event::*;
    pub use super::session::*;
    pub use super::auth::*;
    pub use super::EventEnvelope;
    pub use super::DomainEvent;
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct EventEnvelope<T> {
    pub id: Uuid,
    pub occurred_at: DateTime<Utc>,
    pub payload: T,
}

impl<T> EventEnvelope<T> {
    pub fn new(payload: T) -> Self {
        Self { 
            id: Uuid::now_v7(),
            occurred_at: Utc::now(),
            payload,
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum DomainEvent {
    Session(EventEnvelope<session::SessionDomainEvent>),
    Auth(EventEnvelope<auth::AuthDomainEvent>)
}