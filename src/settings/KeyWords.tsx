import {FC} from "react";
import {Condition, KeyWord} from "../atoms/config.ts";
import {Button, Input, Select} from "antd";
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
            <div className={styles.osc_key}><Input value={keyword.osc.key} placeholder={"/avatar/parameters/VRCEmote"} onChange={(event)=>{
              keyword.osc.key = event.target.value;
              onChange([...data])
            }} /></div>
            <div className={styles.osc_value}>
              <Select value={keyword.osc.type} onChange={(value)=>{
                keyword.osc.type = value;
                onChange([...data])
              }}>
                <Select.Option value={"int"}>int</Select.Option>
                <Select.Option value={"float"}>float</Select.Option>
              </Select>
              <Input value={keyword.osc.value} placeholder={"0"} onChange={(event)=>{
                keyword.osc.value = event.target.value;
                onChange([...data])
              }} onBlur={()=>{
                keyword.osc.value = `${Number(keyword.osc.value)||0}`;
                onChange([...data])
              }} />
            </div>
            <div className={styles.action}><Button onClick={() => onChange(data.filter((k) => k.id !== keyword.id))}><TbTrash/></Button></div>
          </div>
        })}
      </div>
      <div>
        <Button onClick={() => onChange([...data, {id: crypto.randomUUID(), name: "",conditions: [{id: crypto.randomUUID(), type: "text", value: ""}] as Condition[], osc: {key: "",value:"",type:"int"}}])}><TbPlus/></Button>
      </div>
    </div>
  )
}