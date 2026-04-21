use tokio::sync::broadcast;
use tracing::info;

use crate::domain::{error::handler::HandlerError, event::DomainEvent};
use std::sync::Arc;

pub mod in_memory_event_bus;

// 事件处理
#[async_trait::async_trait]
pub trait EventHandler: Send + Sync {
    async fn precheck(&self, event: &DomainEvent) -> bool;
    async fn handle(&self, event: &DomainEvent) -> Result<(), HandlerError>;
}

// 事件总线，专注于分发
pub trait EventBus: Send + Sync {
    fn publish(&self, event: DomainEvent);
    fn subscribe(&self) -> broadcast::Receiver<Arc<DomainEvent>>;
}

#[derive(Clone)]
pub struct Registry {
    bus: Arc<dyn EventBus>,
}

impl Registry {
    pub fn new(bus: Arc<dyn EventBus>) -> Self {
        Self { bus }
    }
    pub fn register<H>(&self, handler: H)
    where
        H: EventHandler + Send + Sync + 'static,
    {
        let mut rx = self.bus.subscribe();
        let handler = Arc::new(handler);

        tokio::spawn(async move {
            loop {
                match rx.recv().await {
                    Ok(event) => {
                        if handler.precheck(&event).await {
                            if let Err(e) = handler.handle(&event).await {
                                eprintln!("Handler failed: {}", e);
                            }
                        }
                    }
                    Err(broadcast::error::RecvError::Lagged(n)) => {
                        eprintln!("Lagged by {} messages", n);
                    }
                    Err(_) => break,
                }
            }
        });
    }
}