import {FC, useId} from "react";
import {Switch} from "antd";
import {useAtom} from "jotai/index";
import {ConfigAtom} from "../../atoms/config.ts";

export const ProfileAutoChange:FC = () => {
  const [config, setConfig] = useAtom(ConfigAtom)
  const switchId = useId();
  return (
    <div>
      <h3>AutoChange</h3>
      <div>
        <Switch value={config.profileAutoSwitch}
                onChange={() => setConfig((pv) => ({...pv, profileAutoSwitch: !pv.profileAutoSwitch}))} id={switchId}/>
        <label htmlFor={switchId}>アバター変更時にプロファイルを自動的に変更する</label>
      </div>
    </div>
  )
}