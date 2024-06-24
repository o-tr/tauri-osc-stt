import type { FC } from "react";
import { ConditionEditor } from "./condition/condition.tsx";
import { ConfigAtom } from "../atoms/config.ts";
import { useAtom } from "jotai";

export const StartStop: FC = () => {
	const [config, setConfig] = useAtom(ConfigAtom);
	return (
		<div>
			<h2>Start/Stop</h2>
			<h3>Start Words</h3>
			<ConditionEditor
				conditions={config.startWords}
				onChange={(data) => {
					config.startWords = data;
					setConfig({ ...config });
				}}
			/>
			<h3>Stop Words</h3>
			<ConditionEditor
				conditions={config.stopWords}
				onChange={(data) => {
					config.stopWords = data;
					setConfig({ ...config });
				}}
			/>
		</div>
	);
};
