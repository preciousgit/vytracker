import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { JSX } from 'react/jsx-runtime';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function for styling components dynamically
export const styled = (element: keyof JSX.IntrinsicElements, ...inputs: ClassValue[]) => {
  return `${String(element)} ${cn(...inputs)}`;
};
