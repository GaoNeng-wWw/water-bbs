use crate::{domain::event::{DomainEvent, EventEnvelope, session::SessionDomainEvent}, infra::eventbus::EventHandler};

pub struct SessionRevoked;

#[async_trait::async_trait]
impl EventHandler for SessionRevoked {
    async fn precheck(&self, event: &DomainEvent) -> bool {
        matches!(event, DomainEvent::Session(env) if matches!(env.payload, SessionDomainEvent::SessionRevoked { .. }))
    }
    async fn handle(&self, event: &DomainEvent) -> Result<(), String> {
        let id = match event {
            DomainEvent::Session(EventEnvelope { payload: SessionDomainEvent::SessionRevoked { session_id }, .. }) => {
                session_id
            }
            _ => unreachable!(),
        };
        todo!("wait session repo");
    }
}