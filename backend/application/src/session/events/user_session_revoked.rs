use std::sync::Arc;

use infra::eventbus::EventHandler;
use domain::prelude::*;

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
        matches!(event, DomainEvent::Session(env) if matches!(env.payload, SessionDomainEvent::UserSessionRevoked { .. }))
    }
    async fn handle(&self, event: &DomainEvent) -> Result<(), HandlerError> {
        let (session_id, account_id) = match event {
            DomainEvent::Session(EventEnvelope { payload, .. }) => {
                match payload {
                    SessionDomainEvent::UserSessionRevoked { session_id, account_id } => (session_id, account_id),
                    _ => unreachable!(),
                }
            },
            _ => unreachable!(),
        };

        self.repo.revoke(&account_id, &session_id).await?;
        Ok(())
    }
}