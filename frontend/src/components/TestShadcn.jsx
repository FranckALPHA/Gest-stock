import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

/**
 * Composant de test pour vérifier que shadcn/ui fonctionne
 */
function TestShadcn() {
  return (
    <div className="p-8 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900">Test des composants shadcn/ui</h1>
      
      {/* Test des classes Tailwind de base */}
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-4">
        Test des classes Tailwind de base - Si ceci est bleu, Tailwind fonctionne
      </div>
      
      {/* Test des boutons */}
      <div className="space-x-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Bouton HTML basique</button>
        <Button>Bouton shadcn/ui</Button>
        <Button variant="secondary">Bouton secondaire</Button>
        <Button variant="outline">Bouton outline</Button>
        <Button variant="destructive">Bouton destructif</Button>
      </div>
      
      {/* Test des badges */}
      <div className="space-x-2">
        <span className="bg-gray-200 px-2 py-1 rounded text-sm">Badge HTML basique</span>
        <Badge>Badge shadcn/ui</Badge>
        <Badge variant="secondary">Badge secondaire</Badge>
        <Badge variant="outline">Badge outline</Badge>
        <Badge variant="destructive">Badge destructif</Badge>
      </div>
      
      {/* Test des cartes */}
      <div className="border border-gray-300 p-4 rounded-lg w-96">
        <h3 className="font-semibold">Carte HTML basique</h3>
        <p>Ceci est une carte HTML basique.</p>
      </div>
      
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Test de carte shadcn/ui</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Ceci est le contenu de la carte de test shadcn/ui.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TestShadcn
