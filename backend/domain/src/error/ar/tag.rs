#[derive(Debug, thiserror::Error)]
pub enum TagError {
    #[error("ALREADY_REMOVED")]
    AlreadyRemoved,
}