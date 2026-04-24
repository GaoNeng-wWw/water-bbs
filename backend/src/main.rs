// 后面记得解决一下warning

#![allow(warnings)]

use crate::intf::http::startup::StartupConfigure;

pub mod domain;
pub mod infra;
pub mod shared;
pub mod intf;
pub mod application;


#[tokio::main]
async fn main() {
    intf::http::startup::startup(
        StartupConfigure { db_url: "sqlite://water_bbs.db".to_owned(), redis_url: "redis://localhost:6379".to_owned() }
    ).await;
}
