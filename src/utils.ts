import {Condition} from "./atoms/config.ts";

export const isSomeConditionSatisfied = (conditions: Condition[], text:string) => {
  return conditions.some((condition) => isConditionSatisfied(condition, text));
}

export const isConditionSatisfied = (condition: Condition, text:string) => {
  if (condition.type === "text" && condition.value != "" ) {
    return text.includes(condition.value);
  } else if (condition.type === "regex") {
    const regex = new RegExp(condition.value);
    return regex.test(text);
  }
}

export const kanaToHira = (str: string) => {
  return str.replace(/[\u30a1-\u30f6]/g, function(match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}
