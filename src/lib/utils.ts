import type { Condition } from "@/atoms/config.ts";
import { type DirEntry, readDir } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";

export const isSomeConditionSatisfied = (
	conditions: Condition[],
	text: string,
) => {
	return conditions.some((condition) => isConditionSatisfied(condition, text));
};

export const isConditionSatisfied = (condition: Condition, text: string) => {
	if (condition.type === "text" && condition.value !== "") {
		return text.includes(condition.value);
	}
	if (condition.type === "regex") {
		const regex = new RegExp(condition.value);
		return regex.test(text);
	}
};

export const kanaToHira = (str: string) => {
	return str.replace(/[\u30a1-\u30f6]/g, (match) => {
		const chr = match.charCodeAt(0) - 0x60;
		return String.fromCharCode(chr);
	});
};

export type CompatDirEntry = DirEntry & {
	path: string;
	children?: CompatDirEntry[];
};

export const compatReadDir = async (
	path: string,
	options?: { recursive: boolean },
): Promise<CompatDirEntry[]> => {
	if (options?.recursive) {
		const files = await compatReadDir(path);
		for (const file of files) {
			if (file.isDirectory) {
				file.children = await compatReadDir(file.path, options);
			}
		}
		return files;
	}
	return await Promise.all(
		(await readDir(path)).map((entry) =>
			(async () => ({
				...entry,
				path: await join(path, entry.name),
			}))(),
		),
	);
};

export const normalizeText = (text?: string) => {
	return kanaToHira(text ?? "")
		.replace(/。/g, "")
		.trim();
};
