import {FC, useState} from "react";
import {useAtom} from "jotai/index";
import {ConfigAtom} from "../../atoms/config.ts";
import styles from "./ProfileList.module.scss";
import {Button, Modal} from "antd";
import {TbPencil, TbTrash} from "react-icons/tb";
import {ProfileEditor} from "./ProfileEditor.tsx";

export const ProfileList: FC = () => {
  const [config, setConfig] = useAtom(ConfigAtom);
  const [editKey, setEditKey] = useState<string>();
  const modalClose = () => setEditKey(undefined)
  
  return <div>
    <h3>ProfileList</h3>
    <div className={styles.table}>
      <div className={styles.header}>
        <div className={styles.name}>Name</div>
        <div className={styles.action}></div>
      </div>
      {Object.entries(config.profiles).map(([key, profile]) => {
        return (<div key={key} className={styles.body}>
          <div className={styles.name}>{profile.name}</div>
          <div className={styles.action}>
            <Button onClick={()=>setEditKey(key)}>
              <TbPencil/>
            </Button>
            <Button disabled={key==="default"} onClick={() => {
              delete config.profiles[key]
              setConfig({...config})
            }}><TbTrash/></Button>
          </div>
        </div>)
      })}
    </div>
    {editKey && <Modal open={true} onOk={modalClose} onCancel={modalClose} width={"calc(100% - 300px)"}><ProfileEditor profile_id={editKey}/></Modal>}
  </div>
}
