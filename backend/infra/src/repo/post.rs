use fred::prelude::Pool;
use sea_orm::DatabaseConnection;

use crate::mapper;

pub struct PostRepo {
    db: DatabaseConnection,
    redis: Pool,
}

const POST_COUNTER:&str = "CNT:POST";
