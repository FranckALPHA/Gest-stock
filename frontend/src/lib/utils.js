import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/**
 * Combine et optimise les classes Tailwind CSS
 * @param {string[]} inputs - Classes CSS à combiner
 * @returns {string} - Classes CSS optimisées
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}