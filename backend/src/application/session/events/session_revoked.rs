use std::sync::Arc;

use crate::{domain::{error::handler::HandlerError, event::{DomainEvent, EventEnvelope, session::SessionDomainEvent}, repo::session::ISessionRepo}, infra::eventbus::EventHandler};

#[derive(Clone)]
pub struct SessionRevoked {
    repo: Arc<dyn ISessionRepo + Send + Sync>
}

impl SessionRevoked {
    pub fn new(repo: Arc<dyn ISessionRepo + Send + Sync>) -> Self {
        Self { repo }
    }
}

#[async_trait::async_trait]
impl EventHandler for SessionRevoked {
    async fn precheck(&self, event: &DomainEvent) -> bool {
        matches!(event, DomainEvent::Session(env) if matches!(env.payload, SessionDomainEvent::SessionRevoked { .. }))
    }
    async fn handle(&self, event: &DomainEvent) -> Result<(), HandlerError> {
        let SessionDomainEvent::SessionRevoked {session_id, account_id} = match event {
            DomainEvent::Session(EventEnvelope { payload, .. }) => payload,
            _ => unreachable!(),
        };

        self.repo.revoke(&account_id, &session_id).await?;
        Ok(())
    }
}