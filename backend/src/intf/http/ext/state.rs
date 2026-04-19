use std::sync::Arc;

use crate::domain::repo::account::IAccountRepo;

#[derive(Clone)]
pub struct AppState {
    pub account_repo: Arc<dyn IAccountRepo>,
    pub redis: Arc<fred::prelude::Pool>,
}