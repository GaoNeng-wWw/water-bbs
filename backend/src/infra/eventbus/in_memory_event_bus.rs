use std::{ops::Deref, sync::Arc};

use tokio::sync::broadcast;

use crate::{domain::event::DomainEvent, infra::eventbus::{EventBus, error::EventBusError}};

#[derive(Clone)]
pub struct InMemoryEventBus {
    sender: broadcast::Sender<Arc<DomainEvent>>,
}

impl InMemoryEventBus {
    pub fn new(capacity: usize) -> Self {
        let (sender, _) = broadcast::channel(capacity);
        Self { sender }
    }
}

#[async_trait::async_trait]
impl EventBus for InMemoryEventBus {
    fn publish_auto_try(&self, event: DomainEvent, retries: Option<i32>) -> Result<usize, EventBusError> {
        let mut attempts = retries.unwrap_or(1);
        let mut last_result = self.publish(event.clone());

        while attempts > 1 && last_result.is_err() {
            last_result = self.publish(event.clone());
            attempts -= 1;
        }

        last_result
    }
    fn publish(&self, event: DomainEvent) -> Result<usize, EventBusError> {
        self.sender.send(Arc::new(event))
        .map_err(|err| {
            return EventBusError::SendFail { event: err.0.deref().clone(), retires: 1 }
        })
    }
    fn subscribe(&self) -> broadcast::Receiver<Arc<DomainEvent>> {
        self.sender.subscribe()
    }
}