import { z } from 'zod'
import {Config_0_0_1} from "@/atoms/config/0_0_1.ts";

export const ZCondition_0_0_2 = z.object({
  id: z.string(),
  type: z.union([z.literal("text"),z.literal("regex")]),
  value: z.string()
})

export const ZOSCValue_0_0_2 = z.object({
  type: z.union([z.literal("float"),z.literal("int")]),
  key: z.string(),
  value: z.string()
})

export const ZKeyWord_0_0_2 = z.object({
  id: z.string(),
  name: z.string(),
  conditions: z.array(ZCondition_0_0_2),
  osc: ZOSCValue_0_0_2,
})

export const ZProfile_0_0_2 = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  keywords: z.array(ZKeyWord_0_0_2)
})

export const ZRemote_0_0_2 = z.object({
  send: z.string(),
  listen: z.string()
})

export const ZConfig_0_0_2 = z.object({
  audio: z.object({
    deviceId: z.string()
  }),
  profiles: z.record(z.string(),ZProfile_0_0_2),
  profileAutoSwitch: z.boolean(),
  startWords: z.array(ZCondition_0_0_2),
  stopWords: z.array(ZCondition_0_0_2),
  remote: ZRemote_0_0_2
})

export type Config_0_0_2 = z.infer<typeof ZConfig_0_0_2>;

export const migrate_0_0_1_to_0_0_2 = (config: Config_0_0_1): Config_0_0_2 => {
  return {
    ...config,
    profiles: {
      default: {
        id: crypto.randomUUID(),
        key: "default",
        name: "default",
        keywords: config.keywords,
      },
    },
    profileAutoSwitch: true,
    remote: { send: "127.0.0.1:9000", listen: "127.0.0.1:9001" },
  };
};
