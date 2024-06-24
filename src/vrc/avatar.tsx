import { type FC, useEffect } from "react";
import { homeDir, join } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { useSetAtom } from "jotai";
import { type AvatarsData, AvatarsDataAtom } from "../atoms/avatar.ts";
import { compatReadDir } from "../utils.ts";

export const VRCAvatarLoader: FC = () => {
	const setDatas = useSetAtom(AvatarsDataAtom);
	useEffect(() => {
		(async () => {
			const homeDirPath = await homeDir();
			const dirs = await compatReadDir(
				await join(homeDirPath, "/AppData/LocalLow/VRChat/VRChat/OSC/"),
				{ recursive: true },
			);
			const result: AvatarsData = {};
			for (const dir of dirs) {
				console.log(dir);
				const user_id = dir.name;
				if (!user_id) continue;
				result[user_id] ??= {};
				for (const file of dir.children?.[0].children ?? []) {
					if (!file.name) continue;
					result[user_id][file.name.substring(0, file.name.length - 5)] =
						JSON.parse((await readTextFile(file.path)).trim());
				}
			}
			setDatas(result);
		})();
	}, [setDatas]);
	return <></>;
};
