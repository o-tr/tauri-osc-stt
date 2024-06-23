// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rosc::encoder;
use rosc::{OscMessage, OscPacket, OscType};
use std::net::{SocketAddrV4, UdpSocket};
use std::str::FromStr;


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    println!("Hello, {}!", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn send(key: &str, value: &str, variant: &str, target: &str) {
    println!("send_osc: key: {}, value: {}, remote: {}", key, value, target);
    let sock = UdpSocket::bind("127.0.0.1:9346").unwrap();
    let remote = SocketAddrV4::from_str(target).unwrap();
    if variant == "float" {
        let msg_buf = encoder::encode(&OscPacket::Message(OscMessage {
            addr: key.to_string(),
            args: vec![OscType::Float(value.parse().unwrap())],
        }))
            .unwrap();

        sock.send_to(&msg_buf, remote).unwrap();
    }else{
        let msg_buf = encoder::encode(&OscPacket::Message(OscMessage {
            addr: key.to_string(),
            args: vec![OscType::Int(value.parse().unwrap())],
        }))
            .unwrap();

        sock.send_to(&msg_buf, remote).unwrap();
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![send])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
