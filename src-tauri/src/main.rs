// Prevents additiopub(crate)nal console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rosc::{encoder, OscMessage, OscPacket, OscType};
use std::{
    ffi::OsStr, net::SocketAddrV4, os::windows::ffi::OsStrExt, rc::Rc, str::FromStr, sync::Arc,
};
use tauri::{AppHandle, Manager, State};
use tokio::{
    net::UdpSocket,
    sync::{mpsc, Mutex},
    task,
};
use webview2_com::Microsoft::Web::WebView2::Win32::{
    ICoreWebView2Profile4, ICoreWebView2SetPermissionStateCompletedHandler,
    ICoreWebView2SetPermissionStateCompletedHandler_Impl, ICoreWebView2_13,
};
use windows::core::*;

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
