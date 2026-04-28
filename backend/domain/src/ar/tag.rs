use chrono::{DateTime, Utc};
use derive_builder::Builder;
use serde::{Deserialize, Serialize};

use crate::{error::ar::tag::TagError, vo::tag_id::TagId};

#[derive(Clone, Debug, Deserialize, Serialize,Builder)]
pub struct Tag {
    #[builder(default=TagId::build())]
    pub id: TagId,
    pub name: String,
    #[builder(default=Utc::now())]
    pub created_at: DateTime<Utc>,
    #[builder(default=None)]
    pub removed_at: Option<DateTime<Utc>>
}

impl Tag {
    pub fn is_removed(&self ) -> bool {
        self.removed_at.is_some()
    }
    pub fn remove(&mut self) -> Result<(), TagError> {
        if self.is_removed() {
            return Err(TagError::AlreadyRemoved);
        }
        self.removed_at = Some(Utc::now());
        Ok(())
    }
}