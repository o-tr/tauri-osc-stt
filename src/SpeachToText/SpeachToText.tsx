import {
	type FC,
	type HTMLProps,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useAtomValue } from "jotai";
import { ConfigAtom } from "@/atoms/config";
import type IWindow from "@/type";
import type { ISpeechRecognition } from "@/type";
import styles from "./SpeachToText.module.scss";
import { isSomeConditionSatisfied, normalizeText } from "@/utils.ts";
import { Button } from "antd";
import { ChatLog, type Log, SystemLog } from "@/atoms/logs.ts";
import { ProfileKeyAtom } from "@/atoms/avatar.ts";
import { invoke } from "@tauri-apps/api/core";
import { ProfileSelection } from "./ProfileSelection.tsx";
import { useLogs } from "@/log.ts";

declare const window: IWindow;

const SpeechRecognition =
	window.webkitSpeechRecognition || window.SpeechRecognition;

export const SpeachToText: FC = () => {
	const config = useAtomValue(ConfigAtom);
	const [log, addLog] = useLogs(ChatLog);
	const [systemLog, addSystemLog] = useLogs(SystemLog);
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
				const text = normalizeText(data[0]?.transcript);
				if (data.isFinal) {
					setText("");
					setLastText(text);
					addLog(text);
				} else {
					setText(text);
				}
			};
			recognition.current.start();
		})().catch((e) => {
			console.error("Failed to start speech recognition", e);
			void invoke("allow_microphone", { addr: location.href });
			setTimeout(() => {
				//location.reload();
			}, 1000);
		});
		return () => {
			recognition.current?.abort();
			recognition.current = undefined;
		};
	}, [selectedDeviceId, addLog]);

	useEffect(() => {
		if (lastText === "") return;
		setLastText("");
		if (isSomeConditionSatisfied(config.startWords, lastText)) {
			addSystemLog("判定開始");
			setIsActive(true);
			return;
		}
		if (isSomeConditionSatisfied(config.stopWords, lastText)) {
			addSystemLog("判定停止");
			setIsActive(false);
			return;
		}
		if (!isActive) return;
		const profile = config.profiles[profileKey];
		if (!profile) return;
		for (const keyword of profile.keywords) {
			if (isSomeConditionSatisfied(keyword.conditions, lastText)) {
				addSystemLog(
					`${keyword.name}: ${keyword.osc.key}->${keyword.osc.value}(${keyword.osc.type})`,
				);
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
	}, [lastText, config, isActive, profileKey, addSystemLog]);

	const toggleIsActive = useCallback(() => {
		setIsActive((pv) => {
			addSystemLog(pv ? "判定停止" : "判定開始");
			return !pv;
		});
	}, [addSystemLog]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.logContainer}>
				<div className={styles.log}>
					<LogList>
						<p style={{ color: "gray" }}>{text}</p>
						{log.toReversed().map((log) => (
							<LogItem key={log.id} log={log} />
						))}
					</LogList>
				</div>
				<div className={styles.log}>
					<LogList>
						{systemLog.toReversed().map((log) => (
							<LogItem key={log.id} log={log} />
						))}
					</LogList>
				</div>
			</div>
			<Button onClick={toggleIsActive}>
				{isActive ? "判定中" : "判定停止中"}
			</Button>
			<ProfileSelection />
		</div>
	);
};

const LogList = (props: HTMLProps<HTMLDivElement>) => {
	return <div {...props} className={styles.list} />;
};

type Props = {
	log: Log;
};
const LogItem: FC<Props> = ({ log }) => {
	return (
		<div className={styles.item}>
			<div className={styles.date}>{log.date}</div>
			<div className={styles.content}>{log.text}</div>
		</div>
	);
};
