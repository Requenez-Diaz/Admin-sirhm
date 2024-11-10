import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formaData = (dateStr: string) => {
  const data = new Date(dateStr);
  console.log(data);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return formatter.format(data);
};
