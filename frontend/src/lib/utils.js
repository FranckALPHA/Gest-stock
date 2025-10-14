import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/**
 * Combine et optimise les classes Tailwind CSS
 * @param {string[]} inputs - Classes CSS à combiner
 * @returns {string} - Classes CSS optimisées
 */
export function cn(...inputs) {
  try {
    return twMerge(clsx(inputs))
  } catch (error) {
    console.error('Erreur dans la fonction cn:', error)
    // Fallback simple si il y a une erreur
    return inputs.filter(Boolean).join(' ')
  }
}