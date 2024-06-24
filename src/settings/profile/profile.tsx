import {FC, useEffect, useState} from "react";
import {ConfigAtom} from "../../atoms/config.ts";
import {useAtom, useAtomValue} from "jotai";
import {AvatarsDataAtom, CurrentAvatarAtom} from "../../atoms/avatar.ts";
import styles from "./profile.module.scss";
import {ProfileAutoChange} from "./autoChange.tsx";
import {AddProfile} from "./AddProfile.tsx";
import {ProfileList} from "./ProfileList.tsx";

export const ProfileSettings: FC = () => {
  const config = useAtomValue(ConfigAtom);
  const avatars = useAtomValue(AvatarsDataAtom);
  const [user, setUser] = useState<string>("default");
  const [avatar, setAvatar] = useState<string>();
  const [profileKey, setProfileKey] = useState<string>("default");
  const currentAvatar = useAtomValue(CurrentAvatarAtom);
  
  
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
  },[currentAvatar, config.profileAutoSwitch, config.profiles])
  
  const profile = config.profiles[profileKey] ?? config.profiles["default"];
  
  console.log(profile, config.profiles, profileKey, user, avatar, avatars)
  
  return (
    <div className={styles.wrapper}>
      <h2>Profile Settings</h2>
      <ProfileAutoChange/>
      <AddProfile/>
      <ProfileList/>
    </div>
  )
}
