const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwtConfig = require('../config/jwt');
const { auth, isAdmin } = require('../middleware/auth');

/**
 * Route pour l'inscription d'un nouvel utilisateur
 * @route POST /api/auth/register
 * @access Public
 */
router.post('/register', [
  check('username', 'Le nom d\'utilisateur est requis').not().isEmpty(),
  check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 }),
  check('email', 'Veuillez fournir un email valide').isEmail(),
  check('role', 'Le rôle est requis').not().isEmpty()
], async (req, res) => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email, role } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      username,
      password, // Le hachage est géré dans le modèle
      email,
      role: role || 'user' // Par défaut, le rôle est 'user'
    });

    // Générer un token JWT
    const payload = {
      user_id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };

    const token = jwt.sign(payload, jwtConfig.secret, jwtConfig.options);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * Route pour la connexion d'un utilisateur
 * @route POST /api/auth/login
 * @access Public
 */
router.post('/login', [
  check('username', 'Le nom d\'utilisateur est requis').not().isEmpty(),
  check('password', 'Le mot de passe est requis').exists()
], async (req, res) => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Authentifier l'utilisateur
    const user = await User.authenticate(username, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Générer un token JWT
    const payload = {
      user_id: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, jwtConfig.secret, jwtConfig.options);

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * Route pour obtenir les informations de l'utilisateur connecté
 * @route GET /api/auth/me
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Utilisateur dans le token:', req.user);
    const user = await User.findById(req.user.user_id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;