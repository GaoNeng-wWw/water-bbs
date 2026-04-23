use std::sync::Arc;

use crate::{application::auth::error::AccountServiceError, domain::{ar::account::Identity, event::{DomainEvent, EventEnvelope}, repo::{account::IAccountRepo, session::ISessionRepo}}, infra::eventbus::EventBus};

pub struct Request {
    pub ident_type: String,
    pub ident_value: String,
}

pub async fn handle(
    req: Request,
    repo: Arc<dyn IAccountRepo>,
    session_repo: Arc<dyn ISessionRepo>,
    event_bus: Arc<dyn EventBus>
) -> Result<(), AccountServiceError> {
    let account = repo.find_account_id_by_ident(
        &Identity {
            ident_type: req.ident_type,
            ident_value: req.ident_value,
            id: uuid::Uuid::now_v7(), // 临时 ID
            ident_verified: false,    // 不影响
        }
    )
    .await?;
    let account_id = account.ok_or(AccountServiceError::AccountNotFound)?;
    // 一定存在, 不然account_id是怎么找到的
    let mut account = repo.get_account(&account_id).await?
        .ok_or(AccountServiceError::AccountNotFound)?;
    let _ = account.deactivate()?;
    repo.update_account(&account).await?;
    let sessions = session_repo.find_session(&account_id).await?;
    if let Some(mut user_session) = sessions {
        let sessions = user_session.clone().sessions;
        let mut events:Vec<DomainEvent> = vec![];
        for session in sessions {
            let id = session.id.clone();
            if user_session.revoke_session(&id).is_ok() {
                events.push(
                    DomainEvent::Session(
                        EventEnvelope::new(
                            crate::domain::event::session::SessionDomainEvent::SessionRevoked { session_id: id.clone(), account_id: account_id.clone() }
                        )
                    )
                );
            }
        }
        for event in events {
            let bus = event_bus.clone();
            tokio::spawn(async move {
                bus.publish(event);
            });
        }
    }
    Ok(())
}
