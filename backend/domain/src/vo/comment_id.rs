use nutype::nutype;

#[nutype(derive(Clone, Debug, PartialEq, Eq, Hash, Serialize, Deserialize, Into, AsRef, Deref))]
pub struct CommentId(uuid::Uuid);

impl CommentId {
    pub fn build() -> Self {
        CommentId::new(uuid::Uuid::now_v7())
    }
}