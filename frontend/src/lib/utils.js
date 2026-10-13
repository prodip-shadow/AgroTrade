import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount) {
  return "৳" + Number(amount || 0).toLocaleString("en-BD");
}
