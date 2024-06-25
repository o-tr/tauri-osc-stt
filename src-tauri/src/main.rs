// Prevents additiopub(crate)nal console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tokio::{
    sync::{Mutex},
};

mod commands;
use crate::commands::{greet::*, microphone::*, osc_receiver::*, osc_sender::*};

fn main() {
    tauri::Builder::default()
        .manage(ShutdownSender {
            sender: Mutex::new(None),
        })
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            send,
            listen,
            unlisten,
            allow_microphone,
            deny_microphone
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
