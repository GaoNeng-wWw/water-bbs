use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::domain::vo::account_id::AccountId;

pub struct AuthSession {
    pub id: Uuid,
    pub account_id: AccountId,
    pub refresh_token: String,
    pub expires_at: DateTime<Utc>,
    pub user_agent: String,
}