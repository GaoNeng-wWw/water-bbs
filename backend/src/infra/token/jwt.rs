
use chrono::{Duration, Utc};
use jose::{JsonWebKey, Jwt, UntypedAdditionalProperties, format::{Compact, DecodeFormat}, jwk::{JwkSigner, JwkVerifier}, jws::{Signer, Unverified}, jwt::Claims, policy::{Checkable, StandardPolicy}};
use serde_json::{Map, Value};

use crate::domain::{ar::auth_session::Token, error::service::token::TokenServiceError, service::token::{ITokenService, IssueTokenRequest}, vo::session::Jti};

#[derive(Clone,Debug)]
pub struct JwtService {}

impl ITokenService for JwtService {
    fn issue_token(&self,request: &IssueTokenRequest, key: &JsonWebKey) -> Result<Token,TokenServiceError>  {
        let jti = Jti::build();
        let key = key.clone();
        if !key.is_signing_key() {
            return Err(TokenServiceError::RequireSignKey)
        }
        let policy = StandardPolicy::default();
        let mut signer: JwkSigner = key
            .check(policy)
            .map_err(|_| TokenServiceError::InvalidKey)?
            .try_into()
            .map_err(|_| TokenServiceError::InvalidKey)?;
        let claims:Claims<Map<String, Value>> = request.clone().into();

        let jwt = Jwt::builder_jwt()
            .build(claims)
            .map_err(|err| TokenServiceError::InvalidHeader { cause: err.to_string() })?;
        let signed_jwt = jwt.sign(&mut signer)
            .map_err(|err| TokenServiceError::Sign { cause: err.to_string() })?;
        let token = signed_jwt.to_string();

        let jwt_ar = Token {
            jti,
            token,
            token_type: request.token_type.clone(),
            ttl: request.ttl,
            created_at: Utc::now(),
            revoked_at: None,
        };
        
        Ok(jwt_ar)
    }

    fn revoke_token(&self,token: &Token) -> Result<Token,TokenServiceError>  {
        let mut token = token.clone();
        match token.revoke() {
            Ok(_) => Ok(token.clone()),
            Err(err) => Err(TokenServiceError::TokenAlreadyRevoked),
        }
    }

    fn verify_token(&self,token_str: &str, key: &JsonWebKey) -> Result<Token,TokenServiceError>  {
        if key.is_signing_key() {
            return Err(TokenServiceError::RequireVerifyKey)
        }
        let key = key.clone();
        let policy = StandardPolicy::default();
        let mut verifier: JwkVerifier = key.check(policy)
            .map_err(|_| TokenServiceError::InvalidKey)?
            .try_into()
            .map_err(|_| TokenServiceError::InvalidKey)?;
        let encoded: Compact = token_str.parse()
            .map_err(|_| TokenServiceError::InvalidToken)?;
        let unverified: Unverified<Jwt<UntypedAdditionalProperties>> = Jwt::decode(encoded)
            .map_err(|_| TokenServiceError::InvalidToken)?;
        let verified = unverified.verify(&mut verifier)
            .map_err(|_| TokenServiceError::InvalidSignature)?;
        let payload = verified.payload();
        let header = verified.header();

        let mut token_data = payload.additional.clone();
        
        token_data.insert("token".to_string(), token_str.into());
        
        let token = serde_json::from_value::<Token>(Value::Object(token_data))
            .map_err(|err| TokenServiceError::DeserializeFail { cause: err.to_string() })?;
        Ok(token)
    }
}


impl From<IssueTokenRequest> for Claims<Map<String, Value>> {
    fn from(req: IssueTokenRequest) -> Self {

        let additional = req.meta.iter().map(|(k, v)| {
            (k.clone(), serde_json::Value::String(v.clone()))
        }).collect();
        let exp_at = Utc::now() + Duration::seconds(req.ttl);
        Claims {
            additional,
            issuer: Some(req.issuer.clone()),
            subject: Some(req.sub.to_string()),
            audience: None,
            expiration: Some(exp_at.timestamp() as u64),
            not_before: None,
            issued_at: Some(Utc::now().timestamp() as u64),
            jwt_id: Some(Jti::build().to_string()),
        }
    }
}