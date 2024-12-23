import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatDuration(duration: number): string {
  // Logic to format duration
  return `${Math.floor(duration / 60)}:${duration % 60}`;
}

export function formatDate(dateInput: any): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  return date.toISOString().split('T')[0];
}
