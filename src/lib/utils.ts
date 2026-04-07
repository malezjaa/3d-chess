import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toChessNotation(col: number, row: number): string {
  const file = String.fromCharCode('A'.charCodeAt(0) + col).toUpperCase();
  const rank = (row + 1).toString();
  return `${file}${rank}`;
}