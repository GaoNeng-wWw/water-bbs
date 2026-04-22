use std::collections::HashMap;

use async_trait::async_trait;
use jose::JsonWebKey;

use crate::domain::{ar::auth_session::{Token, TokenType}, error::service::token::TokenServiceError, vo::account_id::AccountId};

#[derive(Clone)]
pub struct IssueTokenRequest {
    pub sub: AccountId,
    pub token_type: TokenType,
    pub ttl: i64,
    pub issuer: String,
    pub meta: HashMap<String, String>
}

#[async_trait]
pub trait ITokenService {
    fn issue_token(&self, request: &IssueTokenRequest, key: &JsonWebKey) -> Result<Token, TokenServiceError>;
    fn revoke_token(&self, token: &Token) -> Result<Token, TokenServiceError>;
    fn verify_token(&self, token_str: &str, key: &JsonWebKey) -> Result<Token, TokenServiceError>;
}