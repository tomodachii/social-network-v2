import clsx, { ClassValue } from "clsx";
import { twMerge, twJoin } from "tailwind-merge";

export const clsxmerge = (...classValues: ClassValue[]) => twMerge(clsx(...classValues));
export const clsxjoin = (...classValues: ClassValue[]) => twJoin(clsx(...classValues));
