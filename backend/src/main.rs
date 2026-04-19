pub mod domain;
pub mod infra;
pub mod shared;
pub mod intf;
pub mod application;


#[tokio::main]
async fn main() {
    intf::http::startup::startup().await;
}
