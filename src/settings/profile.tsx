import {FC, useEffect, useId, useState} from "react";
import {ConfigAtom} from "../atoms/config.ts";
import {useAtom, useAtomValue} from "jotai";
import {AvatarsDataAtom, CurrentAvatarAtom} from "../atoms/avatar.ts";
import {Button, Select, Switch} from "antd";
import styles from "./profile.module.scss";
import {KeyWords} from "./KeyWords.tsx";
import {TbPlus} from "react-icons/tb";

export const ProfileSettings: FC = () => {
  const [config, setConfig] = useAtom(ConfigAtom)
  const avatars = useAtomValue(AvatarsDataAtom);
  const [user, setUser] = useState<string>("default");
  const [avatar, setAvatar] = useState<string>();
  const [profileKey, setProfileKey] = useState<string>("default");
  const currentAvatar = useAtomValue(CurrentAvatarAtom);
  
  const switchId = useId();
  
  useEffect(()=>{
    if (!config.profileAutoSwitch)return;
    if (currentAvatar && avatars[currentAvatar.user_id]?.[currentAvatar.avatar_id]) {
      setUser(currentAvatar.user_id)
      setAvatar(currentAvatar.avatar_id)
      setProfileKey(`${currentAvatar.user_id}/${currentAvatar.avatar_id}`)
      return;
    }
    setUser("default")
    setAvatar(undefined)
    setProfileKey("default")
  },[currentAvatar, config.profileAutoSwitch])
  
  const profile = config.profiles[profileKey] ?? config.profiles["default"];
  
  console.log(profile, config.profiles, profileKey, user, avatar, avatars)
  
  return (
    <div className={styles.wrapper}>
      <h2>Profile Settings</h2>
      <div>
        <Switch value={config.profileAutoSwitch} onChange={()=>setConfig((pv)=>({...pv,profileAutoSwitch: !pv.profileAutoSwitch}))} id={switchId}/>
        <label htmlFor={switchId}>アバター変更時にプロファイルを自動的に変更する</label>
      </div>
      
      <div className={styles.selection}>
        <div className={styles.item}>
          <Select value={user} onChange={(e)=> {
            setUser(e)
            setAvatar(undefined)
            if (e === "default") {
              setProfileKey("default")
            }else{
              setProfileKey(``)
            }
          }} className={styles.input}>
            {Object.keys(avatars).map((user) => {
              return <Select.Option key={user} value={user}>{user}</Select.Option>
            })}
            <Select.Option value={"default"}>default</Select.Option>
          </Select>
        </div>
        <div className={styles.item}>
          {user && avatars[user] && <Select value={avatar} onChange={(e)=> {
            setAvatar(e)
            setProfileKey(`${user}/${e}`)
          }} className={styles.input}>
            {Object.entries(avatars[user]).map(([profile,data]) => {
              return <Select.Option key={profile} value={profile}>{data.name}</Select.Option>
            })}
          </Select>}
        </div>
        <div>
          {user && avatar &&
            <Button onClick={()=>{
              setConfig({...config, profiles: {...config.profiles, [profileKey]: {id: crypto.randomUUID(), key: profileKey, name: avatars[user][avatar].name, keywords: []}}})
            }}>
              <TbPlus/>
            </Button>
          }
        </div>
      </div>
      {profileKey && profile && <div>
        <h3>Profile: {profile.name}</h3>
        <div>
          <KeyWords data={profile.keywords} onChange={(data)=>{
            profile.keywords = data
            setConfig({...config, profiles: {...config.profiles, [profileKey]: profile}})
          }}/>
        </div>
      </div>}
    </div>
  )
}