const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

/**
 * Middleware d'authentification qui vérifie la validité du token JWT
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const auth = (req, res, next) => {
  // Récupérer le token depuis le header Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Ajouter les informations de l'utilisateur à la requête
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};

/**
 * Middleware qui vérifie si l'utilisateur est un administrateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
  }
};

module.exports = { auth, isAdmin };