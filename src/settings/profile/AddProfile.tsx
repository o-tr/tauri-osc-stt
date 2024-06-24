import { type FC, useState } from "react";
import styles from "./profile.module.scss";
import { Button, Select } from "antd";
import { TbPlus } from "react-icons/tb";
import { useAtom, useAtomValue } from "jotai/index";
import { AvatarsDataAtom } from "../../atoms/avatar.ts";
import { ConfigAtom } from "../../atoms/config.ts";

export const AddProfile: FC = () => {
	const [user, setUser] = useState<string>("default");
	const [avatar, setAvatar] = useState<string>();
	const [profileKey, setProfileKey] = useState<string>("default");
	const avatars = useAtomValue(AvatarsDataAtom);
	const [config, setConfig] = useAtom(ConfigAtom);
	return (
		<div>
			<h3>AddProfile</h3>

			<div className={styles.selection}>
				<div className={styles.item}>
					<Select
						value={user}
						onChange={(e) => {
							setUser(e);
							setAvatar(undefined);
							setProfileKey("");
						}}
						className={styles.input}
					>
						{Object.keys(avatars).map((user) => {
							return (
								<Select.Option key={user} value={user}>
									{user}
								</Select.Option>
							);
						})}
					</Select>
				</div>
				<div className={styles.item}>
					{user && avatars[user] && (
						<Select
							value={avatar}
							onChange={(e) => {
								setAvatar(e);
								setProfileKey(`${user}/${e}`);
							}}
							className={styles.input}
						>
							{Object.entries(avatars[user]).map(([profile, data]) => {
								return (
									<Select.Option key={profile} value={profile}>
										{data.name}
									</Select.Option>
								);
							})}
						</Select>
					)}
				</div>
				<div>
					{user && avatar && (
						<Button
							onClick={() => {
								setConfig({
									...config,
									profiles: {
										...config.profiles,
										[profileKey]: {
											id: crypto.randomUUID(),
											key: profileKey,
											name: avatars[user][avatar].name,
											keywords: [],
										},
									},
								});
							}}
							disabled={!!config.profiles[profileKey]}
						>
							<TbPlus />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
