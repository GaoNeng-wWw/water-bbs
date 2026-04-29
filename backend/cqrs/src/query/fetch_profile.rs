use derive_builder::Builder;
use domain::prelude::{AccountId, query::{error::QueryError, profile::ProfileQueryError}};
use sea_orm::{DatabaseConnection, EntityTrait, prelude::async_trait::async_trait};

use crate::query::{Query};

pub struct FetchProfileContext {
    pub database_connect: DatabaseConnection,
}

#[async_trait]
impl Query for FetchProfileContext {
    type Result = FetchProfileResult;
    type Error = QueryError;
    type Query = FetchProfileQuery;
    async fn execute(&self, query: &Self::Query) -> Result<Self::Result, Self::Error> {
        let db = &self.database_connect;
        let profile = infra::entity::profile::Entity::find_by_id(
            query.account_id.clone().into_inner()
        )
        .one(db)
        .await
        .map_err(|err| QueryError::DatabaseError { cause: err.to_string() })?
        .map(|profile| infra::mapper::profile::to_domain(&profile))
        .ok_or(QueryError::ProfileQueryError(ProfileQueryError::ProfileNotFound))?;
        Ok(
            FetchProfileResult {
                account_id: query.account_id.clone(),
                name: profile.name,
                bio: profile.bio,
                avatar: profile.avatar,
            }
        )
    }
}

#[derive(Clone,Builder)]
pub struct FetchProfileQuery {
    pub account_id: AccountId,
}

#[derive(Clone)]
pub struct FetchProfileResult {
    pub account_id: AccountId,
    pub name: String,
    pub bio: Option<String>,
    pub avatar: Option<String>,
}