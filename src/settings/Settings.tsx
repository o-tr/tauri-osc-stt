import { FC, useCallback } from 'react'
// import { AudioSettings } from './Audio'
import {ConfigAtom, KeyWord} from '../atoms/config'
import { useAtom } from 'jotai'
import {KeyWords} from "./KeyWords.tsx";
import {StartStop} from "./StartStop.tsx";

export const Settings: FC = () => {
  const [config, setConfig] = useAtom(ConfigAtom)

  // const onAudioChange = useCallback((deviceId: string) => {
  //   setConfig((prev) => ({ ...prev, audio: { deviceId } }))
  // }, [])
  
  const onKeyWordsChange = useCallback((keywords: KeyWord[]) => {
    setConfig((prev) => ({ ...prev, keywords }))
  },[]);

  return (
    <div>
      <h1>Settings</h1>
      {/*<AudioSettings selectedDeviceId={config.audio.deviceId} onChange={onAudioChange} />*/}
      <StartStop/>
      <KeyWords data={config.keywords} onChange={onKeyWordsChange} />
    </div>
  )
}
