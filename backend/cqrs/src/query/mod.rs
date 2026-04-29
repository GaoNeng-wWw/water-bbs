use sea_orm::prelude::async_trait::async_trait;

pub mod fetch_profile;

#[async_trait]
pub trait Query {
    type Result;
    type Error;
    type Query;
    async fn execute(&self, query: &Self::Query,) -> Result<Self::Result, Self::Error>;
}