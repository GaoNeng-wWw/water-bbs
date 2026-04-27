use crate::domain::error::{IntoApiError, validate::ValidatorError};

pub enum Rule<T> {
    Must(Box<dyn Fn(&T) -> bool + Send + Sync>, Box<dyn IntoApiError>),
    And(
        Vec<Rule<T>>
    ),
    Or(Vec<Rule<T>>),
    Not(Box<Rule<T>>)
}

impl<T> Rule<T> {
    pub fn run(&self, val: &T) -> Result<bool, &Box<dyn IntoApiError>>{
        match self {
            Rule::Must(f, err) => {
                if f(val) {
                    return Ok(true)
                } else {
                    return Err(err)
                }
            },
            Rule::And(rules) => {
                for r in rules{
                    r.run(val)?;
                }
                Ok(true)
            },
            Rule::Or(rules) => {
                if rules.iter().any(|r| r.run(val).is_ok()) {
                    Ok(true)
                } else {
                    Err(rules[0].run(val).unwrap_err())
                }
            },
            Rule::Not(rule) => {
                if let Err(reason) = rule.run(val) {
                    return Err(reason)
                } else {
                    Ok(true)
                }
            },
        }
    }
}

pub trait ValidateDto {
    fn validate_to_domain(&self) -> Result<(), ValidatorError>;
}