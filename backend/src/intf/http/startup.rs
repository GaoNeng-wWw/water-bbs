use std::{sync::Arc, time::Duration};

use fred::{prelude::{Pool, ClientLike, Config, TcpConfig}, types::Builder};
use lettre::SmtpTransport;
use sea_orm::{ConnectOptions, Database, DatabaseConnection, DbErr};
use tracing::{info, level_filters::LevelFilter};

use crate::{domain::{event::verification_code_sent_event::VerificationCodeSentEvent, service::verify_code::VerifyCodeService}, infra::{config::{policy::redis_features::RedisFeaturesProvider, provider::redis::RedisConfigLoader}, eventbus::{Registry, in_memory_event_bus::InMemoryEventBus}, notification::{dispatcher::NotificationDispatcher, sender::mail_sender::MailSender}, repo::account::AccountRepo}, intf::http::ext::state::AppState};

#[tracing::instrument(name="redis", skip_all, fields(url=%url))]
async fn startup_redis(
    url: &str,
) -> Result<Pool, Box<dyn std::error::Error>>{
    let config = Config::from_url(url).unwrap();
    let pool = Builder::from_config(config)
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

#[tracing::instrument(name="db", skip_all, fields(url=%url))]
async fn setup_database(
    url: &str,
) -> Result<DatabaseConnection, DbErr> {
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

pub async fn event_startup(
    capacity: usize,
){
    let bus = Arc::new(InMemoryEventBus::new(capacity));
    let registry = Registry::new(bus);
    // registry.register(handler);
}

pub async fn startup(){

    tracing_subscriber::fmt()
        .with_max_level(LevelFilter::INFO) 
        .init();
    let root_span = tracing::info_span!("app_startup");
    let _enter = root_span.enter();
    
    info!("Starting application initialization...");

    let db = setup_database("sqlite://water_bbs.db").await.unwrap();
    let redis= startup_redis("redis://localhost:6379").await.unwrap();
    let account_repo = Arc::new(AccountRepo::new(db, redis.clone()));
    let loader = RedisConfigLoader::new(redis.clone());
    let provider = RedisFeaturesProvider::new(Arc::new(loader));
    let (tx, rx) = tokio::sync::broadcast::channel::<VerificationCodeSentEvent>(100);
    let verify_code_service = VerifyCodeService::new(tx, redis.clone());

    let smtp_client = SmtpTransport::unencrypted_localhost();


    let notification_dispatcher = Arc::new(
        NotificationDispatcher::new(
                vec![
                    Box::new(MailSender::new(smtp_client))
                ],
            rx
        )
    );
    tokio::spawn(async move {
        let _ = notification_dispatcher.run().await;
    });
    let state = AppState {
        account_repo,
        redis: Arc::new(redis),
        policy_provider: Arc::new(provider),
        verify_code_service: Arc::new(verify_code_service),
    };
    let app = axum::Router::new()
    .with_state(state);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

}