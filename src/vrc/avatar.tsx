import {FC, useEffect} from "react";
import {homeDir, join} from "@tauri-apps/api/path";
import {readDir, readTextFile} from "@tauri-apps/api/fs";
import {useSetAtom} from "jotai";
import {AvatarsData, AvatarsDataAtom} from "../atoms/avatar.ts";


export const VRCAvatarLoader:FC = ( ) => {
  const setDatas = useSetAtom(AvatarsDataAtom)
  useEffect(()=>{
    (async()=>{
      const homeDirPath = await homeDir();
      const dirs = await readDir(await join(homeDirPath,"/AppData/LocalLow/VRChat/VRChat/OSC/"),{ recursive: true });
      const result: AvatarsData = {};
      for (const dir of dirs){
        console.log(dir);
        const user_id = dir.name;
        if (!user_id) continue;
        result[user_id] ??= {};
        for (const file of dir.children?.[0].children??[]){
          if (!file.name) continue;
          result[user_id][file.name.substring(0,file.name.length-5)] = JSON.parse((await readTextFile(file.path)).trim());
        }
      }
      setDatas(result);
    })();
  },[]);
  return <></>;
}