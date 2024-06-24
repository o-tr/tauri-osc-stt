import { ConfigLoader } from "./ConfigLoader";
import { Settings } from "./settings/Settings";
import type { FC } from "react";
import { TalkToText } from "./TalkToText";
import styles from "./app.module.scss";
import { VRCLoader } from "./vrc/vrc.tsx";

const App: FC = () => {
	return (
		<div className={styles.wrapper}>
			<TalkToText />
			<Settings />
			<ConfigLoader />
			<VRCLoader />
		</div>
	);
};

export default App;
