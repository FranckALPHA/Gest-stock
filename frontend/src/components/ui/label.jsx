import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Composant Label - Étiquette pour les champs de formulaire
 * @param {Object} props - Propriétés du composant
 * @param {string} [props.className] - Classes CSS supplémentaires
 * @param {React.ReactNode} props.children - Contenu du label
 * @returns {JSX.Element} - Composant Label
 */
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
