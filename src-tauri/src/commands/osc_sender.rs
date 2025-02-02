use rosc::{encoder, OscMessage, OscPacket, OscType};
use std::{net::SocketAddrV4, str::FromStr};
use tokio::net::UdpSocket;

#[tauri::command]
pub async fn send(
    key: &str,
    value: &str,
    variant: &str,
    host: &str,
    target: &str,
) -> Result<(), String> {
    println!(
        "send_osc: key: {}, value: {}, remote: {}",
        key, value, target
    );
    let sock = UdpSocket::bind(host).await.unwrap();
    let remote = SocketAddrV4::from_str(target).unwrap();
    if variant == "float" {
        let msg_buf = encoder::encode(&OscPacket::Message(OscMessage {
            addr: key.to_string(),
            args: vec![OscType::Float(value.parse().unwrap())],
        }))
        .unwrap();

        sock.send_to(&msg_buf, remote).await.unwrap();
    } else {
        let msg_buf = encoder::encode(&OscPacket::Message(OscMessage {
            addr: key.to_string(),
            args: vec![OscType::Int(value.parse().unwrap())],
        }))
        .unwrap();

        sock.send_to(&msg_buf, remote).await.unwrap();
    }
    Ok(())
}
