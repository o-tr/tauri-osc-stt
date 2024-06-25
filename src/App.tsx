import { ConfigLoader } from "@/ConfigLoader";
import { Settings } from "@/settings/Settings";
import type { FC } from "react";
import styles from "@/app.module.scss";
import { VRCLoader } from "@/vrc/vrc.tsx";
import { SpeachToText } from "@/SpeachToText";

const App: FC = () => {
	return (
		<div className={styles.wrapper}>
			<SpeachToText />
			<Settings />
			<ConfigLoader />
			<VRCLoader />
		</div>
	);
};

export default App;
