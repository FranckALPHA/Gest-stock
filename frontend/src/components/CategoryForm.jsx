import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'

// Schéma de validation pour les catégories
const categorySchema = z.object({
  name: z.string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  description: z.string()
    .max(200, 'La description ne peut pas dépasser 200 caractères')
    .optional()
    .or(z.literal(''))
})

/**
 * Composant de formulaire pour créer ou modifier une catégorie
 * @param {Object} props - Propriétés du composant
 * @param {Object} [props.initialData] - Données initiales pour la modification
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission
 * @param {Function} props.onCancel - Fonction appelée lors de l'annulation
 * @returns {JSX.Element} - Formulaire de catégorie
 */
function CategoryForm({ initialData, onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Configuration du formulaire avec react-hook-form
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || ''
    }
  })

  /**
   * Gère la soumission du formulaire
   * @param {Object} data - Données du formulaire
   */
  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      // Nettoyer les données (supprimer les chaînes vides)
      const cleanData = {
        name: data.name.trim(),
        description: data.description?.trim() || null
      }
      await onSubmit(cleanData)
    } catch (err) {
      // Les erreurs sont gérées par le composant parent
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Champ nom */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la catégorie *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Électronique, Vêtements, Alimentaire..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de la catégorie..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : (initialData ? 'Modifier' : 'Créer')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CategoryForm
