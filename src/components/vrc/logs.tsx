import { type FC, useEffect, useState } from "react";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { homeDir, join } from "@tauri-apps/api/path";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { useAtomValue, useSetAtom } from "jotai";
import { ConfigAtom } from "@/atoms/config.ts";
import { SystemLog } from "@/atoms/logs.ts";
import { CurrentAvatarAtom } from "@/atoms/avatar.ts";
import { compatReadDir } from "@/lib/utils.ts";
import { invoke } from "@tauri-apps/api/core";
import { useLogs } from "@/hooks/log.ts";

export const VRCLogsLoader: FC = () => {
	const config = useAtomValue(ConfigAtom);
	const [, addSystemLog] = useLogs(SystemLog);
	const [watchLog, setWatchLog] = useState<string>("");
	const setCurrentAvatar = useSetAtom(CurrentAvatarAtom);

	useEffect(() => {
		const reload = async () => {
			const homeDirPath = await homeDir();
			const dirs = await compatReadDir(
				await join(homeDirPath, "/AppData/LocalLow/VRChat/VRChat/"),
			);
			const files = dirs.filter((dir) => dir.name?.startsWith("output_log_"));
			const datas = await Promise.all(
				files.map(async (file) => {
					const data = await readTextFile(file.path);
					const len = data.length;
					const last_update_date = data
						.substring(len - 1000, len - 3)
						.match(
							/([0-9]+\.[0-9]+\.[0-9]+ [0-9]+:[0-9]+:[0-9]+) [\s\S]+/,
						)?.[1];
					if (!last_update_date) return { ...file, date: -1 };
					return {
						...file,
						date: new Date(last_update_date).getTime(),
					};
				}),
			);
			const latest_log = datas.sort((a, b) => b.date - a.date)[0];
			setWatchLog((pv) => {
				if (pv === latest_log.path) return pv;
				addSystemLog(`Watching ${latest_log.name}`);
				return latest_log.path;
			});
		};
		void reload();
		const interval = setInterval(reload, 1000 * 60 * 5);
		return () => clearInterval(interval);
	}, [addSystemLog]);

	useEffect(() => {
		const update = async () => {
			if (!watchLog) return;
			const data = await readTextFile(watchLog);
			const user_id = data.match(/User Authenticated: .* \((usr_.*)\)/)?.[1];
			const avatar_id = data.match(
				/(?:Loading|Saving) Avatar Data:(avtr_.*)[\s\S]*?$/,
			)?.[1];
			if (!user_id || !avatar_id) return;
			setCurrentAvatar((pv) => {
				if (pv?.user_id && pv.avatar_id) return pv;
				addSystemLog(`[AvatarChanged/Log] Avatar:${avatar_id}`);
				return { user_id, avatar_id };
			});
		};
		void update();
		const interval = setInterval(update, 1000 * 60);
		return () => clearInterval(interval);
	}, [watchLog, setCurrentAvatar, addSystemLog]);

	useEffect(() => {
		let unlisten: UnlistenFn | undefined;
		void invoke("listen", { host: config.remote.listen });
		async function f() {
			unlisten = await listen("avatar_change", (event) => {
				const avatar_id = `${event.payload}`;

				setCurrentAvatar((pv) => {
					if (pv && pv.avatar_id === avatar_id) return pv;
					addSystemLog(`[AvatarChanged/OSC] Avatar:${avatar_id}`);
					if (!pv) return { user_id: "", avatar_id };
					return { user_id: pv.user_id, avatar_id };
				});
			});
		}
		void f();
		return () => {
			void invoke("unlisten");
			if (unlisten) {
				unlisten();
			}
		};
	}, [config, setCurrentAvatar, addSystemLog]);
	return <></>;
};
