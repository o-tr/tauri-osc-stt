import { ConfigLoader } from "@/ConfigLoader";
import { Settings } from "@/components/settings/Settings";
import type { FC } from "react";
import styles from "@/app.module.scss";
import { VRCLoader } from "@/components/vrc/vrc.tsx";
import { SpeachToText } from "@/components/SpeachToText";

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
