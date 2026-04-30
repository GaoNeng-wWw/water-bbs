use std::sync::Arc;

use sea_orm::prelude::async_trait::async_trait;

pub mod fetch_profile;

#[async_trait]
pub trait Query {
    type Result: Send + Sync;
    type Error: Send + Sync;
    type Query: Send + Sync;
    async fn execute(&self, query: &Self::Query,) -> Result<Self::Result, Self::Error>;
}

#[async_trait]
impl<F> Query for Arc<F>
where
    F: Query + ?Sized + Send + Sync,
{
    type Result = F::Result;
    type Error = F::Error;
    type Query = F::Query;

    async fn execute(&self, query: &Self::Query) -> Result<Self::Result, Self::Error> {
        (**self).execute(query).await
    }
}


#[async_trait]
impl<F> Query for &Arc<F>
where
    F: Query + ?Sized + Send + Sync,
{
    type Result = F::Result;
    type Error = F::Error;
    type Query = F::Query;

    async fn execute(&self, query: &Self::Query) -> Result<Self::Result, Self::Error> {
        (**self).execute(query).await
    }
}