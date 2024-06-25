import {FC} from "react";
import {Input, Select} from "antd";
import {OSCItem} from "@/atoms/config.ts";

type Props = {
  data: OSCItem[],
  onChange: (data: OSCItem[]) => void;
}

export const OSCEditor:FC<Props> = ({data,onChange}) => {
  return (
    <div>
      {data.map((item) => {
        return <div>
          <Input
            value={item.key}
            placeholder={"/avatar/parameters/VRCEmote"}
            onChange={(event) => {
              item.key = event.target.value;
              onChange([...data]);
            }}
          />
          <Select
            value={item.type}
            onChange={(value) => {
              item.type = value;
              onChange([...data]);
            }}
          >
            <Select.Option value={"int"}>int</Select.Option>
            <Select.Option value={"float"}>float</Select.Option>
          </Select>
        </div>
      })}
    </div>
  )
}