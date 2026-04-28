use nutype::nutype;

#[nutype(derive(Clone, Debug, PartialEq, Eq, Hash, Serialize, Deserialize, Into, AsRef, Deref))]
pub struct ThreadId(uuid::Uuid);

impl ThreadId {
    pub fn build() -> Self {
        ThreadId::new(uuid::Uuid::now_v7())
    }
}