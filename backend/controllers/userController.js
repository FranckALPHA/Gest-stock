const { validationResult } = require('express-validator');
const User = require('../models/userModel');

/**
 * Liste tous les utilisateurs (admin uniquement)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function listUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Active ou désactive un utilisateur (admin uniquement)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function toggleUserActive(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.params.id, 10);
    const { is_active } = req.body;

    const changes = await User.toggleActive(id, is_active);
    if (!changes) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const updatedUser = await User.findById(id);
    res.json({
      message: `Utilisateur ${is_active ? 'activé' : 'désactivé'} avec succès`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Modifie le mot de passe d'un utilisateur (admin uniquement)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateUserPassword(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.params.id, 10);
    const { new_password } = req.body;

    const changes = await User.updatePassword(id, new_password);
    if (!changes) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Désactive un utilisateur (admin uniquement)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deactivateUser(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const changes = await User.toggleActive(id, false);
    if (!changes) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const updatedUser = await User.findById(id);
    res.json({
      message: 'Utilisateur désactivé avec succès',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Active un utilisateur (admin uniquement)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function activateUser(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const changes = await User.toggleActive(id, true);
    if (!changes) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const updatedUser = await User.findById(id);
    res.json({
      message: 'Utilisateur activé avec succès',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  listUsers,
  toggleUserActive,
  activateUser,
  deactivateUser,
  updateUserPassword,
};
