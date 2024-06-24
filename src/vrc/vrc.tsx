import type { FC } from "react";
import { VRCAvatarLoader } from "./avatar.tsx";
import { VRCLogsLoader } from "./logs.tsx";

export const VRCLoader: FC = () => {
	return (
		<>
			<VRCAvatarLoader />
			<VRCLogsLoader />
		</>
	);
};
