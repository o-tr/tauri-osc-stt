import {z} from "zod";
import {Config_0_0_2} from "@/atoms/config/0_0_2.ts";

export const ZCondition_0_0_3 = z.object({
  id: z.string(),
  type: z.union([z.literal("text"), z.literal("regex")]),
  value: z.string(),
});

export const ZOSCValue_0_0_3 = z.union([
  z.object({
    type: z.literal("value"),
    value: z.string()
  }),
  z.object({
    type: z.literal("random"),
    min: z.number(),
    max: z.number()
  })
])

export const ZOSCItem_0_0_3 = z.object({
  type: z.union([z.literal("float"), z.literal("int")]),
  key: z.string(),
  value: ZOSCValue_0_0_3,
  delay: z.number(),
});

export const ZKeyWord_0_0_3 = z.object({
  id: z.string(),
  name: z.string(),
  conditions: z.array(ZCondition_0_0_3),
  osc: z.array(ZOSCItem_0_0_3),
});

export const ZProfile_0_0_3 = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  keywords: z.array(ZKeyWord_0_0_3),
});

export const ZRemote_0_0_3 = z.object({
  send: z.string(),
  listen: z.string(),
});

export const ZConfig_0_0_3 = z.object({
  audio: z.object({
    deviceId: z.string(),
  }),
  profiles: z.record(z.string(), ZProfile_0_0_3),
  profileAutoSwitch: z.boolean(),
  startWords: z.array(ZCondition_0_0_3),
  stopWords: z.array(ZCondition_0_0_3),
  remote: ZRemote_0_0_3,
});

export type Profile_0_0_3 = z.infer<typeof ZProfile_0_0_3>;
export type Config_0_0_3 = z.infer<typeof ZConfig_0_0_3>;

export const migrate_0_0_2_to_0_0_3 = (config: Config_0_0_2): Config_0_0_3 => {
  const profile: Record<string, Profile_0_0_3> = {};
  for (const [key, value] of Object.entries(config.profiles)) {
    profile[key] = {
      ...value,
      keywords: value.keywords.map((keyword) => ({
        ...keyword,
        osc: [{
          ...keyword.osc,
          delay: 0,
          value: {
            type: "value",
            value: keyword.osc.value,
          }
        }],
      })),
    };
  }

  return {
    ...config,
    profiles: profile,
  };
}
