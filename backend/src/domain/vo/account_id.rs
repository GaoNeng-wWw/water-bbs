use nutype::nutype;

#[nutype(
    derive(Debug, Clone, PartialEq, Eq, Hash, AsRef, Deref),
)]
pub struct AccountId(uuid::Uuid);

impl AccountId {
    pub fn build() -> Self {
        AccountId::new(uuid::Uuid::now_v7())
    }
}
