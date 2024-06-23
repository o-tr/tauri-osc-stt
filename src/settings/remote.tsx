import {FC} from "react";
import {Input} from "antd";
import { useAtom } from "jotai";
import {ConfigAtom} from "../atoms/config.ts";

export const RemoteConfig:FC = () => {
  const [config, setConfig] = useAtom(ConfigAtom)
  return (
    <div>
      <h2>RemoteConfig</h2>
      <Input value={config.remote} onChange={(e)=> {
        config.remote = e.target.value
        setConfig({...config})
      }}/>
    </div>
  )
}