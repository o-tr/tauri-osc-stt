import {atom} from "jotai";

export const CurrentAvatarAtom = atom<{user_id:string,avatar_id:string}|undefined>(undefined);

type AvatarParameterType = "Int"|"Float"|"Bool";

export type AvatarParameter = {
  name: string;
  input:{
    address: string;
    type: AvatarParameterType;
  }
  output:{
    address: string;
    type: AvatarParameterType;
  }
}

export type AvatarOscData = {
  id: string,
  name: string,
  parameters: AvatarParameter[];
}

export type AvatarsData = {[user: string]: {[avatar: string]: AvatarOscData}};
export const AvatarsDataAtom = atom<AvatarsData>({});
