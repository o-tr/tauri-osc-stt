import { atom } from "jotai";
import { z } from "zod";

export const ZCondition = z.object({
	id: z.string(),
	type: z.union([z.literal("text"), z.literal("regex")]),
	value: z.string(),
});

export const ZOSCValue = z.object({
	type: z.union([z.literal("float"), z.literal("int")]),
	key: z.string(),
	value: z.string(),
});

export const ZKeyWord = z.object({
	id: z.string(),
	name: z.string(),
	conditions: z.array(ZCondition),
	osc: ZOSCValue,
});

export const ZProfile = z.object({
	id: z.string(),
	key: z.string(),
	name: z.string(),
	keywords: z.array(ZKeyWord),
});

export const ZRemote = z.object({
	send: z.string(),
	listen: z.string(),
});

export const ZLegacyConfig_0_0_1 = z.object({
	audio: z.object({
		deviceId: z.string(),
	}),
	keywords: z.array(ZKeyWord),
	startWords: z.array(ZCondition),
	stopWords: z.array(ZCondition),
	remote: ZRemote,
});

export const ZConfig = z.object({
	audio: z.object({
		deviceId: z.string(),
	}),
	profiles: z.record(z.string(), ZProfile),
	profileAutoSwitch: z.boolean(),
	startWords: z.array(ZCondition),
	stopWords: z.array(ZCondition),
	remote: ZRemote,
});

export type Condition = z.infer<typeof ZCondition>;
export type OSCValue = z.infer<typeof ZOSCValue>;
export type KeyWord = z.infer<typeof ZKeyWord>;
export type Config = z.infer<typeof ZConfig>;
export type LegacyConfig_0_0_1 = z.infer<typeof ZLegacyConfig_0_0_1>;

const migrate_0_0_1_to_0_0_2 = (config: LegacyConfig_0_0_1) => {
	return {
		...config,
		profiles: {
			default: {
				id: crypto.randomUUID,
				key: "default",
				name: "default",
				keywords: config.keywords,
			},
		},
		profileAutoSwitch: true,
		keywords: undefined,
	};
};

export const ConfigAtom = atom<Config>(
	(() => {
		try {
			let value = JSON.parse(localStorage.getItem("config") || "{}");
			if (ZLegacyConfig_0_0_1.safeParse(value).success) {
				value = migrate_0_0_1_to_0_0_2(value);
			}
			return ZConfig.parse(value);
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
