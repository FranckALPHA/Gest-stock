import { Printer } from 'lucide-react'
import { Button } from './ui/button'

/**
 * Composant bouton d'impression réutilisable
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre du document à imprimer
 * @param {React.ReactNode} props.children - Contenu à imprimer
 * @param {string} [props.variant='outline'] - Variante du bouton
 * @param {string} [props.size='sm'] - Taille du bouton
 * @param {string} [props.className=''] - Classes CSS supplémentaires
 * @returns {JSX.Element} - Bouton d'impression
 */
function PrintButton({ title, children, variant = 'outline', size = 'sm', className = '' }) {
  /**
   * Gère l'impression du contenu
   */
  const handlePrint = () => {
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank')
    
    // Contenu HTML pour l'impression
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              line-height: 1.6;
            }
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .print-title {
              font-size: 24px;
              font-weight: bold;
              margin: 0 0 10px 0;
            }
            .print-date {
              font-size: 14px;
              color: #666;
              margin: 0;
            }
            .print-content {
              margin-top: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .print-footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1 class="print-title">${title}</h1>
            <p class="print-date">Généré le ${new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          <div class="print-content">
            ${children}
          </div>
          <div class="print-footer">
            <p>Document généré par le système de gestion de stock</p>
          </div>
        </body>
      </html>
    `
    
    // Écrire le contenu et déclencher l'impression
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // Attendre que le contenu soit chargé puis imprimer
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      className={`print-button ${className}`}
    >
      <Printer className="w-4 h-4 mr-2" />
      Imprimer
    </Button>
  )
}

export default PrintButton
