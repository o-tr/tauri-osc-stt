import { type FC, useCallback, useEffect, useState } from "react";
import { Select } from "antd";
import styles from "./audio.module.scss";

type AudioSettingsProps = {
	selectedDeviceId: string;
	onChange: (deviceId: string) => void;
};

export const AudioSettings: FC<AudioSettingsProps> = ({
	selectedDeviceId,
	onChange,
}) => {
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

	const updateDevices = useCallback(async (): Promise<void> => {
		const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
			(device) => device.kind === "audioinput",
		);
		setDevices(devices);
	}, []);

	useEffect(() => {
		void updateDevices();
	}, [updateDevices]);

	return (
		<div className={styles.wrapper}>
			<label>Audio device</label>
			<Select value={selectedDeviceId} onChange={(e) => onChange(e)}>
				{devices.map((device) => (
					<Select.Option key={device.deviceId} value={device.deviceId}>
						{device.label}
					</Select.Option>
				))}
			</Select>
		</div>
	);
};
