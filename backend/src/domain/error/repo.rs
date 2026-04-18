#[derive(thiserror::Error, Debug)]
pub enum RepositoryError {
    #[error("DATABASE_ERROR")]
    DatabaseError { reason: String  },
    #[error("CONNECTION_ERROR")]
    ConnectionError,
    #[error("TRANSACTION_ERROR")]
    TransactionError,
    #[error("ENTITY_NOT_FOUND")]
    EntityNotFound,
    #[error("REDIS_ERROR")]
    RedisError { reason: String },
    #[error("THREAD_ERROR")]
    ThreadError { reason: String },
}