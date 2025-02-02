import type { FC } from "react";
import { Button, Input, Select } from "antd";
import { TbPlus, TbTrash } from "react-icons/tb";
import type { Condition } from "@/atoms/config.ts";
import styles from "./condition.module.scss";
import { kanaToHira } from "@/lib/utils.ts";

type Props = {
	conditions: Condition[];
	onChange: (data: Condition[]) => void;
};

export const ConditionEditor: FC<Props> = ({ conditions, onChange }) => {
	return (
		<div className={styles.wrapper}>
			{conditions.map((condition) => {
				return (
					<div className={styles.condition} key={condition.id}>
						<Select
							value={condition.type}
							onChange={(value) => {
								condition.type = value;
								onChange([...conditions]);
							}}
						>
							<Select.Option value={"text"}>{"text"}</Select.Option>
							<Select.Option value={"regex"}>{"regex"}</Select.Option>
						</Select>
						<Input
							value={condition.value}
							onChange={(event) => {
								condition.value = event.target.value;
								onChange([...conditions]);
							}}
							onBlur={() => {
								condition.value = kanaToHira(condition.value).trim();
								onChange([...conditions]);
							}}
						/>
						<Button
							onClick={() => {
								conditions = conditions.filter((c) => c.id !== condition.id);
								onChange([...conditions]);
							}}
						>
							<TbTrash />
						</Button>
					</div>
				);
			})}
			<div className={styles.control}>
				<Button
					onClick={() => {
						conditions.push({
							id: crypto.randomUUID(),
							type: "text",
							value: "",
						});
						onChange([...conditions]);
					}}
				>
					<TbPlus />
				</Button>
			</div>
		</div>
	);
};
