// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rosc::encoder;
use rosc::{OscMessage, OscPacket, OscType};
use std::net::{SocketAddrV4};
use std::str::FromStr;
use tokio::net::UdpSocket;
use tokio::sync::{mpsc, Mutex};
use std::sync::Arc;
use tauri::{AppHandle, Manager, State};
use tokio::task;

struct ShutdownSender {
    sender: Mutex<Option<mpsc::Sender<()>>>,
}


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    println!("Hello, {}!", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn send(key: &str, value: &str, variant: &str, host:&str, target: &str) -> Result<(), String> {
    println!("send_osc: key: {}, value: {}, remote: {}", key, value, target);
    let sock = UdpSocket::bind(host).await.unwrap();
    let remote = SocketAddrV4::from_str(target).unwrap();
    if variant == "float" {
        let msg_buf = encoder::encode(&OscPacket::Message(OscMessage {
            addr: key.to_string(),
            args: vec![OscType::Float(value.parse().unwrap())],
        }))
            .unwrap();

        sock.send_to(&msg_buf, remote).await.unwrap();
    }else{
        let msg_buf = encoder::encode(&OscPacket::Message(OscMessage {
            addr: key.to_string(),
            args: vec![OscType::Int(value.parse().unwrap())],
        }))
            .unwrap();

        sock.send_to(&msg_buf, remote).await.unwrap();
    }
    Ok(())
}


#[tauri::command]
async fn listen(app_handle: AppHandle, host: &str, state: State<'_, ShutdownSender>) -> Result<(), String> {
    let target = host;
    while let Some(sender) = state.sender.lock().await.take() {
        sender.send(()).await.map_err(|e| e.to_string())?;
    }
    println!("Listening on {}", target);
    let addr = SocketAddrV4::from_str(target).unwrap();
    let sock = std::net::UdpSocket::bind(addr).map_err(|e| e.to_string())?;
    sock.set_nonblocking(true).map_err(|e| e.to_string())?;
    let sock = UdpSocket::from_std(sock).map_err(|e| e.to_string())?;
    let mut buf = [0u8; rosc::decoder::MTU];

    let (tx, mut rx) = mpsc::channel(1);
    *state.sender.lock().await = Some(tx);
    let app_handle = Arc::new(Mutex::new(app_handle));

    // リスンループのスレッドを別スレッドで実行
    let handle = task::spawn(async move {
        loop {
            tokio::select! {
                result = sock.recv_from(&mut buf) => {
                    match result {
                        Ok((size, _)) => {
                            let (_, packet) = rosc::decoder::decode_udp(&buf[..size]).unwrap();
                            match packet {
                                OscPacket::Message(msg) => {
                                    if msg.addr == "/avatar/change" {
                                        let app_handle = app_handle.lock().await;
                                        app_handle.emit_all("avatar_change", msg.args[0].clone().string())
                                            .expect("TODO: panic message");
                                    }
                                }
                                OscPacket::Bundle(bundle) => {
                                    println!("OSC Bundle: {:?}", bundle);
                                }
                            }
                        }
                        Err(e) => {
                            println!("Error receiving from socket: {}", e);
                            break;
                        }
                    }
                },
                _ = rx.recv() => {
                    // キャンセルメッセージを受信
                    println!("Listening loop canceled.");
                    break;
                }
            }
        }
    });

    // リスンループが終了するのを待つ
    handle.await.map_err(|e| e.to_string())?;
    println!("Listening loop finished. {}", target);
    Ok(())
}

// 中断を実行するためのコマンド
#[tauri::command]
async fn unlisten(state: State<'_, ShutdownSender>) -> Result<(), String> {
    if let Some(sender) = state.sender.lock().await.take() {
        sender.send(()).await.map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .manage(ShutdownSender {
            sender: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![greet,send,listen,unlisten])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
