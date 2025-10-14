import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Composant Separator - Séparateur horizontal ou vertical
 * @param {Object} props - Propriétés du composant
 * @param {string} [props.className] - Classes CSS supplémentaires
 * @param {boolean} [props.orientation] - Orientation du séparateur (horizontal ou vertical)
 * @param {boolean} [props.decorative] - Si le séparateur est décoratif
 * @returns {JSX.Element} - Composant Separator
 */
const Separator = React.forwardRef(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

export { Separator }
