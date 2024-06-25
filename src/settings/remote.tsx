import type { FC } from "react";
import { Input } from "antd";
import { useAtom } from "jotai";
import { ConfigAtom } from "@/atoms/config.ts";

export const RemoteConfig: FC = () => {
	const [config, setConfig] = useAtom(ConfigAtom);
	return (
		<div>
			<h2>RemoteConfig</h2>
			<h3>Send</h3>
			<Input
				value={config.remote.send}
				onChange={(e) => {
					config.remote.send = e.target.value;
					setConfig({ ...config });
				}}
			/>
			<h3>Listen</h3>
			<Input
				value={config.remote.listen}
				onChange={(e) => {
					config.remote.listen = e.target.value;
					setConfig({ ...config });
				}}
			/>
		</div>
	);
};
