use std::env;
use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};
use reqwest::Client;
use dotenv::dotenv;
use chrono::Utc;
use serde_json::{Value, from_str};

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Choice {
    text: String,
    is_correct: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Question {
    text: String,
    choices: Vec<Choice>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Quiz {
    subject: String,
    difficulty: String,
    questions: Vec<Question>,
}

#[derive(Serialize, Deserialize)]
struct GroqRequest {
    model: String,
    messages: Vec<GroqMessage>,
    response_format: Option<ResponseFormat>,
}

#[derive(Serialize, Deserialize)]
struct GroqMessage {
    role: String,
    content: String,
}

#[derive(Serialize, Deserialize)]
struct ResponseFormat {
    #[serde(rename = "type")]
    format_type: String,
}

#[tauri::command]
async fn generate_quiz(subject: String, difficulty: String) -> Result<String, String> {
    dotenv().ok();
    let api_key_raw = env::var("GROQ_API_KEY").map_err(|_| "GROQ_API_KEY not found in env")?;
    let api_key = api_key_raw.trim();
    let url = "https://api.groq.com/openai/v1/chat/completions";

    let prompt = format!(
        "Generate a {} quiz about '{}' with exactly 10 questions. \
        Each question must have 3 choices, one correct and two wrong. \
        Return STRICT JSON in the following format: \
        {{ \"subject\": \"{}\", \"difficulty\": \"{}\", \"questions\": [ {{ \"text\": \"Question text\", \"choices\": [ {{ \"text\": \"Answer 1\", \"is_correct\": true }}, {{ \"text\": \"Answer 2\", \"is_correct\": false }}, {{ \"text\": \"Answer 3\", \"is_correct\": false }} ] }} ] }}",
        difficulty, subject, subject, difficulty
    );

    let request_body = GroqRequest {
        model: "llama-3.3-70b-versatile".to_string(),
        messages: vec![
            GroqMessage {
                role: "system".to_string(),
                content: "You are a quiz generator that outputs only valid JSON.".to_string(),
            },
            GroqMessage {
                role: "user".to_string(),
                content: prompt,
            },
        ],
        response_format: Some(ResponseFormat {
            format_type: "json_object".to_string(),
        }),
    };

    let client = Client::new();
    let res = client.post(url)
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&request_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        let status = res.status();
        let error_text = res.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("Groq API Error ({}): {}", status, error_text));
    }

    let json_val: Value = res.json().await.map_err(|e| format!("Failed to parse API response: {}", e))?;
    
    let quiz_json_str = json_val["choices"][0]["message"]["content"].as_str()
        .ok_or_else(|| "Failed to extract quiz JSON from response".to_string())?;

    // Validate structure
    let _quiz: Quiz = from_str(quiz_json_str).map_err(|e| format!("Invalid quiz JSON format: {}", e))?;

    Ok(quiz_json_str.to_string())
}

#[tauri::command]
async fn save_quiz(subject: String, quiz_json: String) -> Result<String, String> {
    let data_dir = Path::new("../data");
    if !data_dir.exists() {
        fs::create_dir(data_dir).map_err(|e| e.to_string())?;
    }

    // Semantic Grouping Logic (Simplified for now: Check if directory contains the subject as substring or vice versa)
    // Ideally this would be another LLM call, but strict string matching is safer for a start.
    // Let's implement a quick directory scan.
    let mut target_dir = data_dir.join(&subject); // Default
    
    // Check existing directories
    if let Ok(entries) = fs::read_dir(data_dir) {
        for entry in entries.flatten() {
            if let Ok(file_type) = entry.file_type() {
                if file_type.is_dir() {
                    let dir_name = entry.file_name();
                    let dir_name_str = dir_name.to_string_lossy();
                    // Simple heuristic: if subject contains dir_name or dir_name contains subject (case insensitive)
                    if subject.to_lowercase().contains(&dir_name_str.to_lowercase()) || dir_name_str.to_lowercase().contains(&subject.to_lowercase()) {
                        target_dir = entry.path();
                        break;
                    }
                }
            }
        }
    }

    if !target_dir.exists() {
        fs::create_dir(&target_dir).map_err(|e| e.to_string())?;
    }

    let file_name = format!("{}_{}.json", subject, Utc::now().timestamp());
    let file_path = target_dir.join(file_name);

    fs::write(&file_path, quiz_json).map_err(|e| e.to_string())?;

    Ok(format!("Saved to {}", file_path.display()))
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![generate_quiz, save_quiz])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
