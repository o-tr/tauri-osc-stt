import {z} from "zod";


export const ZCondition_0_0_1 = z.object({
  id: z.string(),
  type: z.union([z.literal("text"),z.literal("regex")]),
  value: z.string()
})

export const ZOSCValue_0_0_1 = z.object({
  type: z.union([z.literal("float"),z.literal("int")]),
  key: z.string(),
  value: z.string()
})

export const ZKeyWord_0_0_1 = z.object({
  id: z.string(),
  name: z.string(),
  conditions: z.array(ZCondition_0_0_1),
  osc: ZOSCValue_0_0_1,
})
export const ZConfig_0_0_1 = z.object({
  audio: z.object({
    deviceId: z.string()
  }),
  keywords: z.array(ZKeyWord_0_0_1),
  startWords: z.array(ZCondition_0_0_1),
  stopWords: z.array(ZCondition_0_0_1),
  remote: z.string()
})

export type Config_0_0_1 = z.infer<typeof ZConfig_0_0_1>;
