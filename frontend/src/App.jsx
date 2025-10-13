import { useState } from 'react'

/**
 * Composant principal de l'application
 * @returns {JSX.Element} - Élément React
 */
function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">Gestion de Stock</h1>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Bienvenue dans votre application de gestion de stock</h2>
          <p className="text-muted-foreground">
            Cette application est en cours de développement. Revenez bientôt pour découvrir toutes les fonctionnalités.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App