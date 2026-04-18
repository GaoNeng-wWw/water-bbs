use nutype::nutype;

#[nutype(
    derive(Debug, Clone, PartialEq, Eq, Hash, AsRef, Deref),
)]
pub struct AccountId(uuid::Uuid);
