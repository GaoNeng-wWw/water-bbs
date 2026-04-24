
use chrono::{Duration, Utc};
use josekit::jwt::{self, JwtPayload};
use serde_json::{Map, Value};

use crate::domain::{ar::auth_session::Token, error::service::token::TokenServiceError, service::token::{ITokenService, IssueTokenRequest}, vo::session::Jti};

#[derive(Clone,Debug)]
pub struct JwtService {}

impl ITokenService for JwtService {
    fn issue_token(&self,request: &IssueTokenRequest, key: &josekit::jwk::Jwk) -> Result<Token,TokenServiceError>  {
        let jti = Jti::build();
        let key = key.clone();
        let mut header = josekit::jws::JwsHeader::new();
        header.set_token_type("jwt");

        let signer = josekit::jws::RS256.signer_from_jwk(&key)
            .map_err(|err| TokenServiceError::CanNotCreateSigner { cause: err.to_string() })?;

        let payload_map = serde_json::to_value(request.clone())
            .map_err(|err| TokenServiceError::SerializeFail { cause: err.to_string() })?;

        let mut payload = JwtPayload::new();
        if let Value::Object(mut map) = payload_map {
            map.insert("jti".to_owned(), Value::String(jti.to_string()));
            let payload_handle = josekit::jwt::JwtPayload::from_map(map)
                .map_err(|err| TokenServiceError::SerializeFail { cause: err.to_string() })?;
            payload = payload_handle;
        }
        let token = jwt::encode_with_signer(&payload,&header,&signer)
            .map_err(|err| TokenServiceError::SignTokenFail { cause: err.to_string() })?;

        let jwt_ar = Token {
            jti,
            token,
            sub: request.sub.clone(),
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

    fn verify_token(&self,token_str: &str, key: &josekit::jwk::Jwk) -> Result<Token,TokenServiceError>  {
        let key = key.clone();
        let verifier = josekit::jws::RS256.verifier_from_jwk(&key)
            .map_err(|err| TokenServiceError::CanNotCreateVerifier { cause: err.to_string() })?;
        
        let (payload, header) = josekit::jwt::decode_with_verifier(token_str, &verifier)
            .map_err(|err| TokenServiceError::VerifyFail)?;

        let claims = payload.claims_set();
        let mut token_data = claims.clone();
        token_data.insert("token".to_string(), token_str.into());
        let token:Token = serde_json::from_value(Value::Object(token_data))
            .map_err(|err| TokenServiceError::DeserializeFail { cause: err.to_string() })?;
        Ok(token)
    }
}
