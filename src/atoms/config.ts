import { atom } from 'jotai'
import { z } from 'zod'

export const ZCondition = z.object({
  id: z.string(),
  type: z.union([z.literal("text"),z.literal("regex")]),
  value: z.string()
})

export const ZOSCValue = z.object({
  type: z.union([z.literal("float"),z.literal("int")]),
  key: z.string(),
  value: z.string()
})

export const ZKeyWord = z.object({
  id: z.string(),
  name: z.string(),
  conditions: z.array(ZCondition),
  osc: ZOSCValue,
})

export const ZConfig = z.object({
  audio: z.object({
    deviceId: z.string()
  }),
  keywords: z.array(ZKeyWord),
  startWords: z.array(ZCondition),
  stopWords: z.array(ZCondition),
  remote: z.string()
})

export type Condition = z.infer<typeof ZCondition>
export type OSCValue = z.infer<typeof ZOSCValue>;
export type KeyWord = z.infer<typeof ZKeyWord>
export type Config = z.infer<typeof ZConfig>


export const ConfigAtom = atom<Config>((()=>{
  try{
    const value = JSON.parse(localStorage.getItem("config")||"{}");
    return ZConfig.parse(value)
  }catch (_){
    const defaultValue: Config = { audio: { deviceId: "default" }, keywords: [], startWords: [], stopWords: [], remote:"127.0.0.1:9000" }
    return defaultValue;
  }
})())
