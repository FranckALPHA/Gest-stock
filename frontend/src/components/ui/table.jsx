import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Composant Table - Tableau principal
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} - Élément React
 */
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

/**
 * Composant TableHeader - En-tête du tableau
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} - Élément React
 */
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

/**
 * Composant TableBody - Corps du tableau
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} - Élément React
 */
const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

/**
 * Composant TableFooter - Pied de page du tableau
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} - Élément React
 */
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

/**
 * Composant TableRow - Ligne du tableau
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} - Élément React
 */
const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

/**
 * Composant TableHead - Cellule d'en-tête
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} - Élément React
 */
const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

/**
 * Composant TableCell - Cellule de données
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} - Élément React
 */
const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

/**
 * Composant TableCaption - Légende du tableau
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} - Élément React
 */
const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
