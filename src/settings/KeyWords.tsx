import {FC} from "react";
import {Condition, KeyWord} from "../atoms/config.ts";
import {Button, Input} from "antd";
import styles from "./keyword.module.scss";
import {TbPlus, TbTrash} from "react-icons/tb";
import {ConditionEditor} from "./condition/condition.tsx";

type Props = {
  data: KeyWord[]
  onChange: (data: KeyWord[]) => void
}

export const KeyWords:FC<Props> = ({data,onChange}) => {
    return (
    <div>
      <h2>KeyWords</h2>
      <div className={styles.table}>
        <div className={styles.header}>
          <div className={styles.name}>Name</div>
          <div className={styles.condition}>Condition</div>
          <div className={styles.osc_key}>OSC Key</div>
          <div className={styles.osc_value}>OSC Value</div>
          <div className={styles.action}/>
        </div>
        {data.map((keyword) => {
          return <div key={keyword.id} className={styles.body}>
            <div className={styles.name}>
              <Input value={keyword.name} placeholder={"Keyword"} onChange={(event)=>{
                keyword.name = event.target.value;
                onChange([...data])
              }} />
            </div>
            <div className={styles.condition}>
              <ConditionEditor conditions={keyword.conditions} onChange={(conditions) => {
                keyword.conditions = conditions;
                onChange([...data])
              }}/>
            </div>
            <div className={styles.osc_key}><Input value={keyword.oscKey} placeholder={"/avatar/parameters/VRCEmote"} onChange={(event)=>{
              keyword.oscKey = event.target.value;
              onChange([...data])
            }} /></div>
            <div className={styles.osc_value}><Input value={keyword.oscValue} placeholder={"0"} onChange={(event)=>{
              keyword.oscValue = event.target.value;
              onChange([...data])
            }} /></div>
            <div className={styles.action}><Button onClick={() => onChange(data.filter((k) => k.id !== keyword.id))}><TbTrash/></Button></div>
          </div>
        })}
      </div>
      <div>
        <Button onClick={() => onChange([...data, {id: crypto.randomUUID(), name: "",conditions: [{id: crypto.randomUUID(), type: "text", value: ""}] as Condition[], oscKey: "", oscValue: ""}])}><TbPlus/></Button>
      </div>
    </div>
  )
}