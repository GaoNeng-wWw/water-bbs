use std::{sync::Arc, time::Duration};

use fred::{prelude::{Config, Pool, TcpConfig}, types::Builder};


pub async fn create_redis() -> Pool {
    let cfg = Config {
        mocks: Some(Arc::new(fred::mocks::Echo)),
        ..Default::default()
    };

    let client = Builder::from_config(cfg)
        .with_connection_config(|config| {
        config.connection_timeout = Duration::from_secs(5);
        config.tcp = TcpConfig {
            nodelay: Some(true),
            ..Default::default()
        };
        })
        .build_pool(5)
        .unwrap();
    client
}