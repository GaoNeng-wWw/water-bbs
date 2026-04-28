use nutype::nutype;

#[nutype(derive(Clone, Debug, PartialEq, Eq, Hash, Serialize, Deserialize, Into, AsRef, Deref))]
pub struct PostId(uuid::Uuid);

impl PostId {
    pub fn build() -> Self {
        PostId::new(uuid::Uuid::now_v7())
    }
}