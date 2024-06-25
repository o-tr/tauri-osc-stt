import { atom } from "jotai";

export type Log = {
	id: string;
	text: string;
	date: string;
};

export const ChatLog = atom<Log[]>([]);
export const SystemLog = atom<Log[]>([]);
