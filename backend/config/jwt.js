/**
 * Configuration des tokens JWT
 * Contient les paramètres pour la génération et la validation des tokens
 */
module.exports = {
  // Clé secrète pour signer les tokens JWT (à remplacer par une variable d'environnement en production)
  secret: process.env.JWT_SECRET || 'default_jwt_secret',
  
  // Durée de validité du token (24 heures)
  expiresIn: '24h',
  
  // Options pour la génération du token
  options: {
    expiresIn: '24h',
    issuer: 'app-gestion-stock'
  }
};