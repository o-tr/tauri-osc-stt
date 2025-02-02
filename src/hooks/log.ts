import { type PrimitiveAtom, useAtom } from "jotai";
import type { Log } from "@/atoms/logs.ts";
import { useCallback } from "react";

export const useLogs = (atom: PrimitiveAtom<Log[]>) => {
	const [logs, setLogs] = useAtom(atom);
	const addLog = useCallback(
		(log: string) => {
			const date = new Date();
			setLogs((prevLogs) => [
				...prevLogs,
				{
					id: crypto.randomUUID(),
					text: log,
					date: `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
				},
			]);
		},
		[setLogs],
	);
	return [logs, addLog] as const;
};

const pad = (input: number) => {
	return input.toString().padStart(2, "0");
};
