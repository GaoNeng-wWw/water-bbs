use std::sync::Arc;

use sea_orm::DatabaseConnection;

use crate::domain::repo::account::IAccountRepo;

#[derive(Clone)]
pub struct AppState {
    pub repo: Arc<dyn IAccountRepo>,
}