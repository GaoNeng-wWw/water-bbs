use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::domain::vo::{account_id::AccountId, money::Money, profile::Profile};

#[derive(Clone,Debug, thiserror::Error)]
pub enum AccountDomainError {
    #[error("NOT_ENOUGH_MONEY")]
    NotEnoughFreeMoney { required: Money, available: Money },
    #[error("CAN_NOT_FIND_CERT")]
    CanNotFindCert,
    #[error("CAN_NOT_APPROVE_IDENTITY")]
    CanNotFindIdentity,
}

#[derive(Clone)]
pub struct Identity {
    pub id: Uuid,
    pub ident_type: String,
    pub ident_value: String,
}

impl Identity {
    pub fn check(&self, ident_type: &str, ident_value: &str) -> bool {
        self.ident_type == ident_type && self.ident_value == ident_value
    }
}

#[derive(Clone)]
pub struct Cert {
    pub id: Uuid,
    pub cert_type: String,
    pub cert_value: String,
    pub verified: bool,
}

impl Cert {
    pub fn verify(&mut self){
        self.verified = true;
    }
    pub fn check(&self, cert_type: &str, cert_value: &str) -> bool {
        self.cert_type == cert_type && self.cert_value == cert_value && self.verified
    }
}

#[derive(Clone)]
pub struct Account {
    pub id: AccountId,
    pub money: Money,
    pub locked_money: Money,
    /// 是否是一个仁慈独裁者
    pub bd: bool,
    pub identity: Vec<Identity>,
    pub cert: Vec<Cert>,
    pub profile: Profile,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

impl Account {
    pub fn free_money(&self) -> Money {
        Money::try_new(
            self.money.clone().into_inner() - self.locked_money.clone().into_inner()
        )
        .unwrap_or(Money::try_new(0).unwrap())
    }
    pub fn lock_money(&mut self, money: Money) -> Result<(), AccountDomainError> {
        self.updated_at = Utc::now();
        let fm = self.free_money();
        if money > fm {
            Err(AccountDomainError::NotEnoughFreeMoney { required: money, available: fm })
        } else {
            self.locked_money += money;
            Ok(())
        }
    }
    pub fn add_identity(&mut self, identity: Identity) {
        self.updated_at = Utc::now();
        self.identity.push(identity);
    }
    pub fn add_cert(&mut self, cert: Cert) {
        self.updated_at = Utc::now();
        self.cert.push(cert);
    }
    // 检查标识符
    pub fn check_identity(&self, ident_type: &str, ident_value: &str) -> Result<(), AccountDomainError> {
        if self.identity.iter().any(|i| i.check(ident_type, ident_value)) {
            Ok(())
        } else {
            Err(AccountDomainError::CanNotFindIdentity)
        }
    }
    // 检查凭证
    pub fn check_cert(&self, cert_type: &str, cert_value: &str) -> Result<(), AccountDomainError> {
        if self.cert.iter().any(|c| c.check(cert_type, cert_value)) {
            Ok(())
        } else {
            Err(AccountDomainError::CanNotFindCert)
        }
    }
    // 验证凭证
    pub fn approve_cert(&mut self, cert_id: &Uuid) -> Result<(), AccountDomainError> {
        let cert = self.cert.iter_mut().find(|c| c.id == *cert_id);
        if let Some(cert) = cert {
            cert.verify();
            Ok(())
        } else {
            Err(AccountDomainError::CanNotFindCert)
        }
    }
}