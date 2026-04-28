use serde::{Deserialize, Serialize};

#[derive(Clone,Debug,Deserialize,Serialize)]
pub enum VisibleStatusVariants {
    Show,
    Hidden,
}

impl ToString for VisibleStatusVariants {
    fn to_string(&self) -> String {
        match self {
            VisibleStatusVariants::Show => "Show".to_string(),
            VisibleStatusVariants::Hidden => "Hidden".to_string(),
        }
    }
}

impl From<String> for VisibleStatusVariants {
    fn from(value: String) -> Self {
        match value.as_str() {
            "Show" | "show" => VisibleStatusVariants::Show,
            "Hidden" | "hidden" => VisibleStatusVariants::Hidden,
            _ => VisibleStatusVariants::Show
        }
    }
}