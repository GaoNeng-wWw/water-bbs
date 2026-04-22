use nutype::nutype;
use uuid::Uuid;

#[nutype(derive(Clone,Debug,Deserialize,Serialize,AsRef,Deref, Eq, PartialEq, Hash))]
pub struct SessionId(Uuid);

impl SessionId {
    pub fn build() -> Self {
        Self::new(Uuid::now_v7())
    }
}

#[nutype(derive(Clone,Debug,Deserialize,Serialize,AsRef,Deref, Eq, PartialEq, Hash))]
pub struct Jti(Uuid);

impl Jti {
    pub fn build() -> Self {
        Self::new(Uuid::now_v7())
    }
}