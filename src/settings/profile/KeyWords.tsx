import { type FC, useState } from "react";
import type { Condition, KeyWord } from "@/atoms/config.ts";
import { Button, Input, Modal } from "antd";
import styles from "./keyword.module.scss";
import { TbPlus, TbSettingsCode, TbTrash } from "react-icons/tb";
import { ConditionEditor } from "../condition";
import { OSCEditor } from "@/settings/profile/OSCEditor";

type Props = {
	data: KeyWord[];
	onChange: (data: KeyWord[]) => void;
};

export const KeyWords: FC<Props> = ({ data, onChange }) => {
	const [oscEditKey, setOscEditKey] = useState<string>();

	const keyword = oscEditKey && data.find((k) => k.id === oscEditKey);

	const closeModal = () => setOscEditKey(undefined);

	return (
		<div>
			<div className={styles.table}>
				<div className={styles.header}>
					<div className={styles.name}>Name</div>
					<div className={styles.condition}>Condition</div>
					<div className={styles.osc_key}>OSC</div>
					<div className={styles.action} />
				</div>
				{data.map((keyword) => {
					return (
						<div key={keyword.id} className={styles.body}>
							<div className={styles.name}>
								<Input
									value={keyword.name}
									placeholder={"Keyword"}
									onChange={(event) => {
										keyword.name = event.target.value;
										onChange([...data]);
									}}
								/>
							</div>
							<div className={styles.condition}>
								<ConditionEditor
									conditions={keyword.conditions}
									onChange={(conditions) => {
										keyword.conditions = conditions;
										onChange([...data]);
									}}
								/>
							</div>
							<div className={styles.osc_key}>
								<Button
									onClick={() => {
										setOscEditKey(keyword.id);
									}}
								>
									<TbSettingsCode />
								</Button>
							</div>
							<div className={styles.action}>
								<Button
									onClick={() =>
										onChange(data.filter((k) => k.id !== keyword.id))
									}
								>
									<TbTrash />
								</Button>
							</div>
						</div>
					);
				})}
			</div>
			<div>
				<Button
					onClick={() =>
						onChange([
							...data,
							{
								id: crypto.randomUUID(),
								name: "",
								conditions: [
									{ id: crypto.randomUUID(), type: "text", value: "" },
								] as Condition[],
								osc: [
									{
										id: crypto.randomUUID(),
										key: "",
										value: { value: "0", type: "value" },
										type: "int",
										delay: "0",
									},
								],
							},
						])
					}
				>
					<TbPlus />
				</Button>
			</div>
			{keyword && (
				<Modal
					open={true}
					onOk={closeModal}
					closable={false}
					footer={(_, { OkBtn }) => <OkBtn />}
					width={"max(calc(100% - 300px), 500px)"}
				>
					<OSCEditor
						data={keyword.osc}
						onChange={(value) => {
							keyword.osc = value;
							onChange([...data]);
						}}
					/>
				</Modal>
			)}
		</div>
	);
};
