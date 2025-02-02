import type { FC } from "react";
// import { AudioSettings } from './Audio'
// import {ConfigAtom} from '../atoms/config'
// import { useAtom } from 'jotai'
import { StartStop } from "./StartStop.tsx";
import { RemoteConfig } from "./remote.tsx";
import { ProfileSettings } from "./profile";

export const Settings: FC = () => {
	// const [config, setConfig] = useAtom(ConfigAtom)

	// const onAudioChange = useCallback((deviceId: string) => {
	//   setConfig((prev) => ({ ...prev, audio: { deviceId } }))
	// }, [])

	return (
		<div>
			<h1>Settings</h1>
			{/*<AudioSettings selectedDeviceId={config.audio.deviceId} onChange={onAudioChange} />*/}
			<StartStop />
			<ProfileSettings />
			<RemoteConfig />
		</div>
	);
};
