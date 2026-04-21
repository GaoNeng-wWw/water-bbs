use std::sync::Arc;

use tokio::sync::broadcast;

use crate::{domain::event::DomainEvent, infra::eventbus::EventBus};

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
    fn publish(&self, event: DomainEvent) {
        let _ = self.sender.send(Arc::new(event));
    }
    fn subscribe(&self) -> broadcast::Receiver<Arc<DomainEvent>> {
        self.sender.subscribe()
    }
}