import { type FC, useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { ConfigAtom } from "@/atoms/config";
import type IWindow from "@/type";
import type { ISpeechRecognition } from "@/type";
import styles from "./SpeachToText.module.scss";
import { isSomeConditionSatisfied, kanaToHira } from "@/utils.ts";
import { Button } from "antd";
import { ChatLog, SystemLog } from "@/atoms/logs.ts";
import { ProfileKeyAtom } from "@/atoms/avatar.ts";
import { invoke } from "@tauri-apps/api/core";
import { ProfileSelection } from "./ProfileSelection.tsx";

declare const window: IWindow;

const SpeechRecognition =
	window.webkitSpeechRecognition || window.SpeechRecognition;

export const SpeachToText: FC = () => {
	const config = useAtomValue(ConfigAtom);
	const [log, setLog] = useAtom(ChatLog);
	const [systemLog, setSystemLog] = useAtom(SystemLog);
	const [lastText, setLastText] = useState<string>("");
	const [text, setText] = useState("");
	const [isActive, setIsActive] = useState(true);
	const profileKey = useAtomValue(ProfileKeyAtom);
	const recognition = useRef<ISpeechRecognition>();
	const selectedDeviceId = config.audio.deviceId;

	useEffect(() => {
		void (async () => {
			if (recognition.current) recognition.current.abort();
			await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: selectedDeviceId },
			});
			recognition.current = new SpeechRecognition();
			recognition.current.lang = "ja-JP";
			recognition.current.interimResults = true;
			recognition.current.onend = () => {
				recognition.current?.start();
			};
			recognition.current.onerror = (...args) => {
				console.log(args);
			};
			recognition.current.onresult = (event) => {
				const data = event.results[0];
				const text = kanaToHira(data[0]?.transcript ?? "")
					.replace(/。/g, "")
					.trim();
				if (data.isFinal) {
					setText("");
					setLastText(text);
					setLog((_pv) => [text, ..._pv]);
				} else {
					setText(text);
				}
			};
			recognition.current.start();
		})().catch((e) => {
			console.error("Failed to start speech recognition", e);
			void invoke("allow_microphone", { addr: location.href });
			setTimeout(() => {
				location.reload();
			}, 1000);
		});
		return () => {
			recognition.current?.abort();
			recognition.current = undefined;
		};
	}, [selectedDeviceId, setLog]);

	useEffect(() => {
		if (lastText === "") return;
		setLastText("");
		if (isSomeConditionSatisfied(config.startWords, lastText)) {
			setSystemLog((_pv) => ["判定開始", ..._pv]);
			setIsActive(true);
			return;
		}
		if (isSomeConditionSatisfied(config.stopWords, lastText)) {
			setSystemLog((_pv) => ["判定停止", ..._pv]);
			setIsActive(false);
			return;
		}
		if (!isActive) return;
		const profile = config.profiles[profileKey];
		if (!profile) return;
		for (const keyword of profile.keywords) {
			if (isSomeConditionSatisfied(keyword.conditions, lastText)) {
				setSystemLog((_pv) => [
					`${keyword.name}: ${keyword.osc.key}->${keyword.osc.value}(${keyword.osc.type})`,
					..._pv,
				]);
				void invoke("send", {
					key: keyword.osc.key,
					value: keyword.osc.value,
					variant: keyword.osc.type,
					host: "127.0.0.1:9024",
					target: config.remote.send,
				});
				return;
			}
		}
	}, [lastText, config, isActive, profileKey, setSystemLog]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.logContainer}>
				<div className={styles.log}>
					<p style={{ color: "gray" }}>{text}</p>
					{log.map((v, i) => (
						<p key={i}>{v}</p>
					))}
				</div>
				<div className={styles.log}>
					{systemLog.map((v, i) => (
						<p key={i}>{v}</p>
					))}
				</div>
			</div>
			<Button
				onClick={() =>
					setIsActive((pv) => {
						if (pv) {
							setSystemLog((_pv) => ["判定停止", ..._pv]);
						} else {
							setSystemLog((_pv) => ["判定開始", ..._pv]);
						}
						return !pv;
					})
				}
			>
				{isActive ? "判定中" : "判定停止中"}
			</Button>
			<ProfileSelection />
		</div>
	);
};
