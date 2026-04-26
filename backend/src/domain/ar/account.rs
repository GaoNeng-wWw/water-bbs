use argon2::{Argon2, PasswordHasher, PasswordVerifier, password_hash::{SaltString, rand_core::OsRng}};
use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::domain::{error::IntoApiError, vo::{account_id::AccountId, money::Money, profile::Profile}};

#[derive(Clone,Debug, thiserror::Error, Serialize)]
pub enum AccountDomainError {
    #[error("NOT_ENOUGH_MONEY")]
    NotEnoughFreeMoney { required: Money, available: Money },
    #[error("CAN_NOT_FIND_CERT")]
    CanNotFindCert,
    #[error("CAN_NOT_FIND_IDENTITY")]
    CanNotFindIdentity,
    #[error("IDENTITY_INCONSISTENT")]
    IdentityInconsistent,
    #[error("CERT_INCONSISTENT")]
    CertInconsistent,
    #[error("ACCOUNT_ALREADY_DEACTIVATED")]
    AccountAlreadyDeactivated,
    #[error("CREATE_CERT_ERROR")]
    CreateCertError,
}

impl IntoApiError for AccountDomainError {
    fn status_code(&self) -> u16 {
        match self {
            AccountDomainError::CreateCertError => 500,
            _ => 400
        }
    }
    fn message(&self) -> String {
        self.to_string()
    }
    
    fn cause(&self) -> Option<serde_json::Value> {
        match self {
            AccountDomainError::NotEnoughFreeMoney { .. } => Some(serde_json::json!(self)),
            AccountDomainError::CanNotFindCert => None,
            AccountDomainError::CanNotFindIdentity => None,
            AccountDomainError::IdentityInconsistent => None,
            AccountDomainError::CertInconsistent => None,
            AccountDomainError::AccountAlreadyDeactivated => None,
            AccountDomainError::CreateCertError => None,
        }
    }
}


#[derive(Clone)]
pub struct Identity {
    pub id: Uuid,
    pub ident_type: String,
    pub ident_value: String,
    pub ident_verified: bool,
}

impl Identity {
    pub fn check(&self, ident_type: &str, ident_value: &str) -> bool {
        self.ident_type == ident_type && self.ident_value == ident_value
    }
    pub fn verify(&mut self){
        self.ident_verified = true;
    }
}

#[derive(Clone, Eq, PartialEq)]
pub struct Cert {
    pub id: Uuid,
    pub cert_type: String,
    pub cert_value: String,
}

impl Cert {
    pub fn new(id: Uuid, cert_type: String, cert_value: String) -> Self {
        Self { id, cert_type, cert_value }
    }
    
    pub fn try_new(cert_type: String, cert_value: String) -> Result<Self, AccountDomainError> {
        let salt = SaltString::generate(OsRng);
        let argon2 = Argon2::default();
        let hash = argon2.hash_password(cert_value.as_bytes(), &salt)
            .map_err(|_| AccountDomainError::CreateCertError)?;
        Ok(Self { id: Uuid::now_v7(), cert_type, cert_value: hash.to_string()})
    }
    
    pub fn check(&self, plain_value: &str) -> Result<bool, AccountDomainError> {
        let parsed_hash = argon2::PasswordHash::new(&self.cert_value)
            .map_err(|_| AccountDomainError::CreateCertError)?;
        Ok(Argon2::default().verify_password(plain_value.as_bytes(), &parsed_hash).is_ok())
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
    pub fn build(
        identity: &Identity,
        cert: &Cert,
        profile: &Profile,
        money: &Money,
    ) -> Self {
        Self {
            id: AccountId::build(),
            money: money.clone(),
            locked_money: Money::try_new(0).unwrap(),
            bd: false,
            identity: vec![identity.clone()],
            cert: vec![cert.clone()],
            profile: profile.clone(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
            deleted_at: None,
        }
    }
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
    pub fn update_identity(&mut self, ident_type: &str, ident_value: &str) {
        self.updated_at = Utc::now();
        self.identity.iter_mut().for_each(|i| {
            if i.check(ident_type, ident_value) {
                i.ident_value = ident_value.to_string();
            }
        });
    }
    pub fn update_cert(
        &mut self,
        cert_type: &str,
        cert_value: &str,
        confirm_value: &str
    ) -> Result<(), AccountDomainError>{
        self.updated_at = Utc::now();
        
        let old_cert = self.find_cert(&cert_type).ok_or(AccountDomainError::CanNotFindCert)?;
        if !old_cert.check(confirm_value)? {
            return Err(AccountDomainError::CertInconsistent);
        }
        let new_cert = Cert::try_new(cert_type.to_string(), cert_value.to_string())?;

        self.cert.iter_mut().for_each(|i| {
            if i.cert_type == cert_type {
                i.cert_value = new_cert.cert_value.clone();
            }
        });

        Ok(())

    }
    pub fn add_identity(&mut self, identity: Identity) {
        self.updated_at = Utc::now();
        self.identity.push(identity);
    }
    pub fn add_cert(&mut self, cert: Cert) {
        self.updated_at = Utc::now();
        self.cert.push(cert);
    }
    pub fn find_identity(&self, ident_type: &str) -> Option<Identity> {
        self.identity.iter().filter(|i| i.ident_type == ident_type)
        .collect::<Vec<_>>()
        .first()
        .cloned().cloned()
    }
    pub fn find_cert(&self, cert_type: &str) -> Option<Cert> {
        self.cert.iter().filter(|c| c.cert_type == cert_type)
        .collect::<Vec<_>>()
        .first()
        .cloned().cloned()
    }
    // 检查标识符
    pub fn check_identity(&self, ident_type: &str, ident_value: &str) -> Result<(), AccountDomainError> {
        let ident_exists = self.identity.iter().any(|i| i.ident_type == ident_type);
        if !ident_exists {
            return Err(AccountDomainError::CanNotFindIdentity);
        }
        if self.identity.iter().any(|i| i.check(ident_type, ident_value)) {
            Ok(())
        } else {
            Err(AccountDomainError::IdentityInconsistent)
        }
    }
    // 检查凭证
    pub fn check_cert(&self, cert_type: &str, cert_value: &str) -> Result<(), AccountDomainError> {
        let cert_exists = self.cert.iter().any(|c| c.cert_type == cert_type);
        if !cert_exists {
            return Err(AccountDomainError::CanNotFindCert);
        }

        for cert in &self.cert {
            if cert.check(cert_value)? {
                return Ok(());
            }
        }

        Err(AccountDomainError::CertInconsistent)
    }
    // 验证凭证
    pub fn approve_cert(&mut self, cert_id: &Uuid) -> Result<bool, AccountDomainError> {
        let cert = self.cert.iter_mut().find(|c| c.id == *cert_id);
        if let Some(_) = cert {
            Ok(true)
        } else {
            Err(AccountDomainError::CanNotFindCert)
        }
    }

    pub fn approve_identity(&mut self, ident_id: &Uuid) -> Result<(), AccountDomainError> {
        self.updated_at = Utc::now();
        let ident = self.identity.iter_mut().find(|i| i.id == *ident_id);
        if let Some(ident) = ident {
            ident.verify();
            return Ok(())
        }
        return Err(AccountDomainError::CanNotFindIdentity);
    }

    pub fn deactivate(&mut self) -> Result<(), AccountDomainError> {
        if self.deleted_at.is_some() {
            return Err(AccountDomainError::AccountAlreadyDeactivated);
        }
        self.deleted_at = Some(Utc::now());
        Ok(())
    }
    pub fn update_profile(&mut self, profile: Profile) {
        self.updated_at = Utc::now();
        let mut _profile = profile.clone();
        _profile.id = self.profile.id;
        self.profile = profile;
    }
    pub fn remove_cert(&mut self, cert: &Cert) {
        self.updated_at = Utc::now();
        self.cert = self.cert.iter().filter(|c| c.cert_type != cert.cert_type).cloned().collect();
    }
}