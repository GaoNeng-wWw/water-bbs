use rand::RngExt;

fn generate(size: usize, include_upper: bool, include_lower: bool, include_special: bool, is_numeric: bool) -> String {
    let mut rng = rand::rng();
    
    let digits = "0123456789";
    let lowers = "abcdefghijklmnopqrstuvwxyz";
    let uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let specials = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let mut charset = String::new();
    
    if is_numeric {
        charset.push_str(digits);
    } else {
        if include_lower { charset.push_str(lowers); }
        if include_upper { charset.push_str(uppers); }
        if include_special { charset.push_str(specials); }
    }

    if charset.is_empty() { charset.push_str(digits); }

    // 将 charset 转换为 Vec<char> 以便索引访问
    let chars: Vec<char> = charset.chars().collect();
    
    (0..size)
        .map(|_| {
            let idx = rng.random_range(0..chars.len());
            chars[idx]
        })
        .collect()
}

pub fn digital(size: usize) -> String {
    generate(size, false, false, false, true)
}

pub fn letter(size: usize) -> String {
    generate(size, true, true, false, false)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_digital_normal_length() {
        let result = digital(10);
        assert_eq!(result.len(), 10);
        assert!(result.chars().all(|c| c.is_ascii_digit()));
    }

    #[test]
    fn test_digital_zero_length() {
        let result = digital(0);
        assert_eq!(result.len(), 0);
        assert!(result.is_empty());
    }

    #[test]
    fn test_digital_single_digit() {
        let result = digital(1);
        assert_eq!(result.len(), 1);
        assert!(result.chars().all(|c| c.is_ascii_digit()));
    }

    #[test]
    fn test_digital_large_length() {
        let result = digital(1000);
        assert_eq!(result.len(), 1000);
        assert!(result.chars().all(|c| c.is_ascii_digit()));
    }

    #[test]
    fn test_digital_randomness() {
        let results: Vec<String> = (0..10).map(|_| digital(20)).collect();
        
        for i in 0..results.len() {
            for j in (i + 1)..results.len() {
                assert_ne!(results[i], results[j], "生成的随机字符串应该是唯一的");
            }
        }
    }

    #[test]
    fn test_letter_normal_length() {
        let result = letter(10);
        assert_eq!(result.len(), 10);
        assert!(result.chars().all(|c| c.is_ascii_alphabetic()));
    }

    #[test]
    fn test_letter_zero_length() {
        let result = letter(0);
        assert_eq!(result.len(), 0);
        assert!(result.is_empty());
    }

    #[test]
    fn test_letter_single_char() {
        let result = letter(1);
        assert_eq!(result.len(), 1);
        assert!(result.chars().all(|c| c.is_ascii_alphabetic()));
    }

    #[test]
    fn test_letter_large_length() {
        let result = letter(500);
        assert_eq!(result.len(), 500);
        assert!(result.chars().all(|c| c.is_ascii_alphabetic()));
    }

    #[test]
    fn test_letter_contains_both_cases() {
        let result = letter(100);
        assert_eq!(result.len(), 100);
        
        let has_uppercase = result.chars().any(|c| c.is_ascii_uppercase());
        let has_lowercase = result.chars().any(|c| c.is_ascii_lowercase());
        
        assert!(has_uppercase || has_lowercase, "应该包含至少一种大小写字母");
    }

    #[test]
    fn test_letter_randomness() {
        let results: Vec<String> = (0..10).map(|_| letter(20)).collect();
        
        for i in 0..results.len() {
            for j in (i + 1)..results.len() {
                assert_ne!(results[i], results[j], "生成的随机字符串应该是唯一的");
            }
        }
    }

    #[test]
    fn test_generate_uppercase_only() {
        let result = generate(10, true, false, false, false);
        assert_eq!(result.len(), 10);
        assert!(result.chars().all(|c| c.is_ascii_uppercase()));
    }

    #[test]
    fn test_generate_lowercase_only() {
        let result = generate(10, false, true, false, false);
        assert_eq!(result.len(), 10);
        assert!(result.chars().all(|c| c.is_ascii_lowercase()));
    }

    #[test]
    fn test_generate_with_special_chars() {
        let result = generate(20, true, true, true, false);
        assert_eq!(result.len(), 20);
        
        let has_special = result.chars().any(|c| "!@#$%^&*()_+-=[]{}|;:,.<>?".contains(c));
        assert!(has_special, "应该包含特殊字符");
    }

    #[test]
    fn test_generate_all_false_fallback_to_digits() {
        let result = generate(10, false, false, false, false);
        assert_eq!(result.len(), 10);
        assert!(result.chars().all(|c| c.is_ascii_digit()), "所有选项为false时应回退到数字");
    }

    #[test]
    fn test_generate_upper_and_lower() {
        let result = generate(20, true, true, false, false);
        assert_eq!(result.len(), 20);
        assert!(result.chars().all(|c| c.is_ascii_alphabetic()));
    }

    #[test]
    fn test_generate_upper_and_special() {
        let result = generate(15, true, false, true, false);
        assert_eq!(result.len(), 15);
        
        for c in result.chars() {
            assert!(c.is_ascii_uppercase() || "!@#$%^&*()_+-=[]{}|;:,.<>?".contains(c));
        }
    }

    #[test]
    fn test_generate_lower_and_special() {
        let result = generate(15, false, true, true, false);
        assert_eq!(result.len(), 15);
        
        for c in result.chars() {
            assert!(c.is_ascii_lowercase() || "!@#$%^&*()_+-=[]{}|;:,.<>?".contains(c));
        }
    }

    #[test]
    fn test_generate_numeric_mode() {
        let result = generate(10, true, true, true, true);
        assert_eq!(result.len(), 10);
        assert!(result.chars().all(|c| c.is_ascii_digit()), "numeric模式应忽略其他选项");
    }

    #[test]
    fn test_generate_zero_length() {
        let result = generate(0, true, true, true, false);
        assert_eq!(result.len(), 0);
        assert!(result.is_empty());
    }

    #[test]
    fn test_generate_single_char() {
        let result = generate(1, true, true, true, false);
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_generate_large_string() {
        let result = generate(10000, true, true, true, false);
        assert_eq!(result.len(), 10000);
    }

    #[test]
    fn test_generate_randomness_various_configs() {
        let configs = vec![
            (true, false, false, false),
            (false, true, false, false),
            (true, true, false, false),
            (true, true, true, false),
        ];

        for (upper, lower, special, numeric) in configs {
            let results: Vec<String> = (0..5).map(|_| generate(20, upper, lower, special, numeric)).collect();
            
            for i in 0..results.len() {
                for j in (i + 1)..results.len() {
                    assert_ne!(results[i], results[j], "配置 {:?} 生成的随机字符串应该是唯一的", (upper, lower, special, numeric));
                }
            }
        }
    }

    #[test]
    fn test_special_chars_set() {
        let result = generate(100, false, false, true, false);
        let special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        
        for c in result.chars() {
            assert!(special_chars.contains(c), "字符 '{}' 不在特殊字符集合中", c);
        }
    }

    #[test]
    fn test_no_invalid_characters() {
        let results = vec![
            digital(50),
            letter(50),
            generate(50, true, false, false, false),
            generate(50, false, true, false, false),
            generate(50, true, true, true, false),
        ];

        for result in results {
            for c in result.chars() {
                assert!(c.is_ascii(), "所有字符都应该是ASCII字符");
            }
        }
    }

    #[test]
    fn test_consistency_with_same_parameters() {
        let size = 20;
        let upper = true;
        let lower = true;
        let special = false;
        let numeric = false;

        let result1 = generate(size, upper, lower, special, numeric);
        let result2 = generate(size, upper, lower, special, numeric);

        assert_ne!(result1, result2, "相同参数应该生成不同的随机字符串");
        assert_eq!(result1.len(), result2.len());
    }

    #[test]
    fn test_generate_all_options_enabled() {
        let result = generate(30, true, true, true, false);
        assert_eq!(result.len(), 30);
        
        let has_digit = result.chars().any(|c| c.is_ascii_digit());
        let has_upper = result.chars().any(|c| c.is_ascii_uppercase());
        let has_lower = result.chars().any(|c| c.is_ascii_lowercase());
        let has_special = result.chars().any(|c| "!@#$%^&*()_+-=[]{}|;:,.<>?".contains(c));

        assert!(has_upper || has_lower || has_special, "应该至少包含字母或特殊字符");
    }
}