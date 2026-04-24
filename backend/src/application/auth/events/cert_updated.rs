use std::sync::Arc;

use crate::{domain::{error::handler::HandlerError, event::{DomainEvent, EventEnvelope, auth::AuthDomainEvent, session::SessionDomainEvent}, repo::session::ISessionRepo}, infra::eventbus::{EventBus, EventHandler}};

#[derive(Clone)]
pub struct CertUpdated {
    repo: Arc<dyn ISessionRepo + Send + Sync>,
    bus: Arc<dyn EventBus>
}

impl CertUpdated {
    pub fn new(repo: Arc<dyn ISessionRepo + Send + Sync>, bus: Arc<dyn EventBus>) -> Self {
        Self { repo, bus }
    }
}

#[async_trait::async_trait]
impl EventHandler for CertUpdated {
    async fn precheck(&self, event: &DomainEvent) -> bool {
        matches!(event, DomainEvent::Auth(env) if matches!(env.payload, AuthDomainEvent::UpdateCert { .. }))
    }
    async fn handle(&self, event: &DomainEvent) -> Result<(), HandlerError> {
        let AuthDomainEvent::UpdateCert {account_id} = match event {
            DomainEvent::Auth(EventEnvelope { payload, .. }) => payload,
            _ => unreachable!(),
        };

        let sessions = self.repo.find_session(account_id).await?;
        let mut event_box:Vec<DomainEvent> = vec![];
        if let Some(sessions) = sessions {
            for ss in sessions.sessions {
                let ev = DomainEvent::Session(
                    EventEnvelope::new(
                        SessionDomainEvent::UserSessionRevoked { session_id: ss.id, account_id: account_id.clone() }
                    )
                );
                event_box.push(ev);
            }
            for ev in event_box {
                let ev = ev.clone();
                let bus = self.bus.clone();
                tokio::spawn(async move {
                    bus.publish(ev);
                });
            }
        }
        Ok(())
    }
}