use chrono::Utc;
use derive_builder::Builder;

use crate::{error::ar::post::PostAggregateError, event::DomainEvent, prelude::{AccountId, PostId}, vo::{post_visible::VisibleStatusVariants, tag_id::TagId}};

#[derive(Debug, Clone, Builder)]
pub struct Post {
    pub id: PostId,
    pub title: String,
    pub author_id: AccountId,
    #[builder(default=vec![])]
    pub tag_ids: Vec<TagId>,
    pub created_at: chrono::DateTime<Utc>,
    pub updated_at: chrono::DateTime<Utc>,
    #[builder(default=VisibleStatusVariants::Show)]
    pub status: VisibleStatusVariants,
    #[builder(default=vec![])]
    pub inbox: Vec<DomainEvent>
}

impl Post {
    pub fn touch(&mut self) {
        self.updated_at = chrono::Utc::now();
    }
    pub fn is_removed(&self) -> bool {
        matches!(self.status, VisibleStatusVariants::Hidden)
    }
    pub fn remove(&mut self) -> Result<(), PostAggregateError> {
        if self.is_removed() {
            return Err(PostAggregateError::PostNotFound { id: self.id.clone() });
        }
        self.status = VisibleStatusVariants::Hidden;
        Ok(())
    }
    pub fn update_title(&mut self, title: String) {
        self.touch();
        self.title = title;
    }
    pub fn update_tag_ids(&mut self, tag_ids: Vec<TagId>) {
        self.touch();
        self.tag_ids = tag_ids;
    }
}