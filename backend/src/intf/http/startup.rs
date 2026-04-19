use std::{sync::Arc, time::Duration};

use fred::{prelude::{Pool, ClientLike, Config, TcpConfig}, types::Builder};
use sea_orm::{ConnectOptions, Database, DatabaseConnection, DbErr};

use crate::{infra::repo::account::AccountRepo, intf::http::ext::state::AppState};

async fn startup_redis() -> Result<Pool, Box<dyn std::error::Error>>{
    let config = Config::from_url("redis://localhost:6379").unwrap();
    let pool = Builder::default_centralized()
            .with_connection_config(|config| {
                config.connection_timeout = Duration::from_secs(5);
                config.tcp = TcpConfig {
                    nodelay: Some(true),
                    ..Default::default()
                };
            })
            .build_pool(5)?;
    pool.init().await?;
    Ok(pool)
}

async fn setup_database(url: &str) -> Result<DatabaseConnection, DbErr> {
    let mut opt = ConnectOptions::new(url.to_owned());
    
    opt.max_connections(100)
       .min_connections(5)
       .connect_timeout(Duration::from_secs(8))
       .acquire_timeout(Duration::from_secs(8))
       .idle_timeout(Duration::from_secs(8))
       .max_lifetime(Duration::from_secs(8))
       .sqlx_logging(true);

    Database::connect(opt).await
}

pub async fn startup(){

    let db = setup_database("sqlite://").await.unwrap();
    let redis= startup_redis().await.unwrap();
    let account_repo = Arc::new(AccountRepo::new(db, redis.clone()));
    let state = AppState {
        account_repo,
        redis: Arc::new(redis),
    };
    let app = axum::Router::new()
    .with_state(state);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

}