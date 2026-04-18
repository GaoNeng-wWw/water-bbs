use rand::seq::IndexedRandom;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

const ADJECTIVES: &[&str] = &[
    "勤劳的", "睿智的", "勇敢的", "快乐的", "幽默的", 
    "神秘的", "优雅的", "热情的", "冷静的", "极客的"
];

const NOUNS: &[&str] = &[
    "代码师", "探险家", "架构师", "梦想家", "观察者", 
    "艺术家", "航海家", "魔法师", "调音师", "破译者"
];

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Profile {
    pub id: Uuid,
    pub name: String,
    pub bio: Option<String>,
    pub avatar: Option<String>,
}

impl Default for Profile {
    fn default() -> Self {
        let mut rng = rand::rng();
        
        let adj = ADJECTIVES.choose(&mut rng).unwrap_or(&"");
        
        let noun = NOUNS.choose(&mut rng).unwrap_or(&"用户");
        
        // 随机后缀，极大程度避免重名，且保留了辨识度
        let suffix = rand::random::<u16>() % 999;

        Self {
            id: Default::default(),
            name: format!("{}{}{}", adj, suffix, noun),
            bio: Default::default(),
            avatar: Default::default()
        }
    }
}

impl Profile {
    pub fn new(id: Uuid, name: String) -> Self {
        Self {
            id,
            name: name,
            bio: None,
            avatar: None,
        }
    }

    pub fn with_bio(mut self, bio: Option<String>) -> Self {
        self.bio = bio;
        self
    }

    pub fn with_avatar(mut self, avatar: Option<String>) -> Self {
        self.avatar = avatar;
        self
    }
}