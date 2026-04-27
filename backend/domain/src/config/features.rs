use serde::{Deserialize, Serialize};

use crate::error::config::PolicyError;

#[derive(Clone, Default, Deserialize, Serialize)]
pub struct Features {
    pub enable_invite: bool,
    pub enable_register_captcha: bool
}

impl Features {
    pub fn can_register(&self, invite_code: Option<&str>, captcha: Option<&str>) -> bool {
        let mut res = true;
        if self.enable_register_captcha {
            res &= captcha.is_some();
        }
        if self.enable_invite {
            res &= invite_code.is_some();
        }
        res

    }
}

#[async_trait::async_trait]
#[mockall::automock]
pub trait IFeaturePolicyProvider {
    async fn get_features(&self) -> Result<Features, PolicyError>;
    async fn put_features(&self, features: &Features) -> Result<(), PolicyError>;
}