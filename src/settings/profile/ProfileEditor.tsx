import type { FC } from "react";
import { ConfigAtom } from "../../atoms/config.ts";
import { useAtom } from "jotai";
import { KeyWords } from "../KeyWords.tsx";

type Props = {
	profile_id: string;
};
export const ProfileEditor: FC<Props> = ({ profile_id }) => {
	const [config, setConfig] = useAtom(ConfigAtom);
	const profile = config.profiles[profile_id];
	if (!profile) return <div>Profile not found</div>;

	return (
		<div>
			<h3>Profile: {profile.name}</h3>
			<div>
				<KeyWords
					data={profile.keywords}
					onChange={(data) => {
						profile.keywords = data;
						setConfig({
							...config,
							profiles: { ...config.profiles, [profile_id]: profile },
						});
					}}
				/>
			</div>
		</div>
	);
};
