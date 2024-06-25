use rosc::OscPacket;
use std::{net::SocketAddrV4, str::FromStr, sync::Arc};
use tauri::{AppHandle, Manager, State};
use tokio::{
    net::UdpSocket,
    sync::{mpsc, Mutex},
    task,
};

pub struct ShutdownSender {
    pub sender: Mutex<Option<mpsc::Sender<()>>>,
}

#[tauri::command]
pub async fn listen(
    app_handle: AppHandle,
    host: &str,
    state: State<'_, ShutdownSender>,
) -> Result<(), String> {
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
                                        app_handle.emit("avatar_change", msg.args[0].clone().string())
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

#[tauri::command]
async fn unlisten(state: State<'_, ShutdownSender>) -> Result<(), String> {
    if let Some(sender) = state.sender.lock().await.take() {
        sender.send(()).await.map_err(|e| e.to_string())?;
    }
    Ok(())
}
