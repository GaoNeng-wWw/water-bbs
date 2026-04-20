use nutype::nutype;

#[nutype(
    validate(greater_or_equal = 0),
    derive(Debug, Clone, PartialEq, Eq, Hash, AsRef, Deref, PartialOrd, Ord, Into, Serialize),
)]
pub struct Money(i32);

impl std::ops::AddAssign for Money {
    fn add_assign(&mut self, rhs: Self) {
        *self = Self::try_new(self.clone().into_inner() + rhs.into_inner()).unwrap();
    }
}
