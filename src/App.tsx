import { ConfigLoader } from './ConfigLoader'
import { Settings } from './settings/Settings'
import { FC } from 'react'
import { TalkToText } from './TalkToText'
import styles from "./app.module.scss"

const App: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TalkToText />
      <Settings />
      <ConfigLoader/>
    </div>
  )
}

export default App
