import type { FC } from "react";
import { Button, Input, Select } from "antd";
import type { OSCItem } from "@/atoms/config.ts";

import styles from "./OSCEditor.module.scss";
import { TbPlus, TbTrash } from "react-icons/tb";

type Props = {
	data: OSCItem[];
	onChange: (data: OSCItem[]) => void;
};

export const OSCEditor: FC<Props> = ({ data, onChange }) => {
	return (
		<>
			<div className={styles.wrapper}>
				{data.map((item) => {
					return (
						<>
							<div className={styles.header} key={`${item.id}_header`}>
								<div className={styles.key}>Key</div>
								<div className={styles.type}>Type</div>
								<div className={styles.value_type}>ValueType</div>
								{item.value.type === "value" && (
									<div className={styles.value}>Value</div>
								)}
								{item.value.type === "random" && (
									<>
										<div className={styles.value_min}>Min</div>
										<div className={styles.value_max}>Max</div>
									</>
								)}
								<div className={styles.delay}>Delay</div>
								<div className={styles.action} />
							</div>
							<div key={item.id} className={styles.item}>
								<Input
									className={styles.key}
									value={item.key}
									placeholder={"/avatar/parameters/VRCEmote"}
									onChange={(event) => {
										item.key = event.target.value;
										onChange([...data]);
									}}
								/>
								<Select
									className={styles.type}
									value={item.type}
									onChange={(value) => {
										item.type = value;
										onChange([...data]);
									}}
								>
									<Select.Option value={"int"}>int</Select.Option>
									<Select.Option value={"float"}>float</Select.Option>
								</Select>
								<Select
									className={styles.value_type}
									value={item.value.type}
									onChange={(value) => {
										item.value =
											value === "value"
												? {
														type: "value",
														value: "0",
													}
												: {
														type: "random",
														min: "0",
														max: "1",
													};
										onChange([...data]);
									}}
								>
									<Select.Option value={"random"}>random</Select.Option>
									<Select.Option value={"value"}>const</Select.Option>
								</Select>
								{item.value.type === "value" && (
									<Input
										className={styles.value}
										value={item.value.value}
										placeholder={"value"}
										onChange={(event) => {
											if (item.value.type !== "value") return;
											item.value.value = event.target.value;
											onChange([...data]);
										}}
										onBlur={() => {
											item.delay = `${Number(item.delay) || 0}`;
										}}
									/>
								)}
								{item.value.type === "random" && (
									<>
										<Input
											className={styles.value_min}
											value={item.value.min}
											placeholder={"min"}
											onChange={(event) => {
												if (item.value.type !== "random") return;
												item.value.min = event.target.value;
												onChange([...data]);
											}}
											onBlur={() => {
												item.delay = `${Number(item.delay) || 0}`;
											}}
										/>
										<Input
											className={styles.value_max}
											value={item.value.max}
											placeholder={"value"}
											onChange={(event) => {
												if (item.value.type !== "random") return;
												item.value.max = event.target.value;
												onChange([...data]);
											}}
											onBlur={() => {
												item.delay = `${Number(item.delay) || 0}`;
											}}
										/>
									</>
								)}
								<Input
									className={styles.delay}
									value={item.delay}
									placeholder={"delay(s)"}
									onChange={(event) => {
										item.delay = event.target.value;
										onChange([...data]);
									}}
									onBlur={() => {
										item.delay = `${Number(item.delay) || 0}`;
									}}
								/>
								<Button
									className={styles.action}
									onClick={() => {
										onChange(data.filter((i) => i.id !== item.id));
									}}
								>
									<TbTrash />
								</Button>
							</div>
						</>
					);
				})}
			</div>
			<Button
				onClick={() => {
					onChange([
						...data,
						{
							id: crypto.randomUUID(),
							key: "",
							type: "int",
							value: { type: "value", value: "0" },
							delay: "0",
						},
					]);
				}}
			>
				<TbPlus />
			</Button>
		</>
	);
};
