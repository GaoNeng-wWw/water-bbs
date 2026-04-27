use tokio::sync::Mutex;

use crate::{infra::notification::sender::NotificationSender};
use domain::prelude::*;

pub struct NotificationDispatcher {
    senders: Vec<Box<dyn NotificationSender>>,
    receiver: Mutex<tokio::sync::broadcast::Receiver<VerificationCodeSentEvent>>,
}

impl NotificationDispatcher {
    pub fn new(senders: Vec<Box<dyn NotificationSender>>, receiver: tokio::sync::broadcast::Receiver<VerificationCodeSentEvent>) -> Self {
        Self { senders, receiver: Mutex::new(receiver) }
    }
    
    pub async fn run(&self) {
        loop {
            let mut receiver = self.receiver.lock().await;
            if let Ok(event) = receiver.recv().await {
                // 查找支持该 Channel 的 Sender 并执行
                for sender in &self.senders {
                    if sender.supports(&event.channel) {
                        let _ = sender.send(event.clone()).await;
                    }
                }
            }
        }
    }
}