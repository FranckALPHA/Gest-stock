const { validationResult } = require('express-validator');
const Category = require('../models/categoryModel');

/**
 * Liste toutes les catégories (avec recherche et pagination)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function listCategories(req, res) {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const result = await Category.findAllWithSearchAndPagination(
      search,
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Récupère une catégorie par ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getCategory(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Crée une nouvelle catégorie
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function createCategory(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = await Category.create({
      name: req.body.name,
      description: req.body.description || null,
    });
    const created = await Category.findById(id);
    res.status(201).json(created);
  } catch (error) {
    if (error && error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ message: 'La catégorie existe déjà' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Met à jour une catégorie
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateCategory(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id, 10);
    const changes = await Category.update(id, {
      name: req.body.name,
      description: req.body.description || null,
    });
    if (!changes) return res.status(404).json({ message: 'Catégorie non trouvée' });
    const updated = await Category.findById(id);
    res.json(updated);
  } catch (error) {
    if (error && error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ message: 'Conflit de contrainte (nom déjà utilisé)' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Supprime une catégorie
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deleteCategory(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const changes = await Category.delete(id);
    if (!changes) return res.status(404).json({ message: 'Catégorie non trouvée' });
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
