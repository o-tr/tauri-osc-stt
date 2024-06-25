import { atom } from "jotai";
import { z } from "zod";
import { ZConfig_0_0_1} from "@/atoms/config/0_0_1.ts";
import {migrate_0_0_1_to_0_0_2, ZConfig_0_0_2} from "@/atoms/config/0_0_2.ts";
import {
	migrate_0_0_2_to_0_0_3,
	ZCondition_0_0_3,
	ZConfig_0_0_3,
	ZKeyWord_0_0_3,
	ZOSCItem_0_0_3, ZOSCValue_0_0_3
} from "@/atoms/config/0_0_3.ts";

export type OSCValue = z.infer<typeof ZOSCValue_0_0_3>;
export type OSCItem = z.infer<typeof ZOSCItem_0_0_3>;
export type Condition = z.infer<typeof ZCondition_0_0_3>;
export type KeyWord = z.infer<typeof ZKeyWord_0_0_3>;
export type Config = z.infer<typeof ZConfig_0_0_3>;

export const ConfigAtom = atom<Config>(
	(() => {
		try {
			let value = JSON.parse(localStorage.getItem("config") || "{}");
			if (ZConfig_0_0_1.safeParse(value).success) {
				value = migrate_0_0_1_to_0_0_2(value);
			}
			if (ZConfig_0_0_2.safeParse(value).success) {
				value = migrate_0_0_2_to_0_0_3(value);
			}
			return ZConfig_0_0_3.parse(value);
		} catch (_) {
			const defaultValue: Config = {
				audio: { deviceId: "default" },
				profiles: {
					default: {
						id: crypto.randomUUID(),
						key: "default",
						name: "default",
						keywords: [],
					},
				},
				profileAutoSwitch: true,
				startWords: [],
				stopWords: [],
				remote: { send: "127.0.0.1:9000", listen: "127.0.0.1:9001" },
			};
			return defaultValue;
		}
	})(),
);
