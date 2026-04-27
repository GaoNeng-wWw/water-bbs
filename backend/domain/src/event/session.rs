use serde::{Deserialize, Serialize};

use crate::vo::{account_id::AccountId, session::SessionId};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum SessionDomainEvent {
    /// 吊销单个会话, 而不是整个用户会话
    UserSessionRevoked { session_id: SessionId, account_id: AccountId },
    /// 会话过期
    /// 会话过期时触发
    Expired { session_id: SessionId, account_id: AccountId },
}