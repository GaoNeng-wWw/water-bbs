use nutype::nutype;

#[nutype(derive(Clone, Debug, PartialEq, Eq, Hash, Serialize, Deserialize, Into, AsRef, Deref))]
pub struct TagId(uuid::Uuid);

impl TagId {
    pub fn build() -> Self{
        TagId::new(uuid::Uuid::now_v7())
    }
}