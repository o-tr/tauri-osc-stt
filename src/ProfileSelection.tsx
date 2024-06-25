import { type FC, useEffect } from "react";
import { Select } from "antd";
import { useAtom, useAtomValue } from "jotai";
import { ConfigAtom } from "@/atoms/config.ts";
import styles from "@/ProfileSelection.module.scss";
import {
	AvatarsDataAtom,
	CurrentAvatarAtom,
	ProfileKeyAtom,
} from "@/atoms/avatar.ts";

export const ProfileSelection: FC = () => {
	const config = useAtomValue(ConfigAtom);
	const avatars = useAtomValue(AvatarsDataAtom);
	const currentAvatar = useAtomValue(CurrentAvatarAtom);
	const [profileKey, setProfileKey] = useAtom(ProfileKeyAtom);

	useEffect(() => {
		if (!config.profileAutoSwitch) return;
		if (
			currentAvatar &&
			avatars[currentAvatar.user_id]?.[currentAvatar.avatar_id] &&
			config.profiles[`${currentAvatar.user_id}/${currentAvatar.avatar_id}`]
		) {
			setProfileKey(`${currentAvatar.user_id}/${currentAvatar.avatar_id}`);
			return;
		}
		setProfileKey("default");
	}, [currentAvatar, config, avatars, setProfileKey]);

	return (
		<div className={styles.wrapper}>
			<span>ActiveProfile: </span>
			<Select
				className={styles.select}
				onChange={(e) => setProfileKey(e)}
				value={profileKey}
			>
				{Object.keys(config.profiles).map((profile) => {
					return (
						<Select.Option key={profile} value={profile}>
							{config.profiles[profile].name}
						</Select.Option>
					);
				})}
			</Select>
		</div>
	);
};
