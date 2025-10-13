const { validationResult } = require('express-validator');
const Product = require('../models/productModel');

/**
 * Liste tous les produits (avec jointures catégorie/fournisseur)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function listProducts(req, res) {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Récupère un produit par ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getProduct(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Crée un nouveau produit
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function createProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = await Product.create({
      name: req.body.name,
      description: req.body.description || null,
      category_id: req.body.category_id || null,
      supplier_id: req.body.supplier_id || null,
      price: req.body.price,
      quantity: req.body.quantity ?? 0,
      alert_threshold: req.body.alert_threshold ?? 10,
    });
    const created = await Product.findById(id);
    res.status(201).json(created);
  } catch (error) {
    if (error && error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ message: 'Contrainte de base de données violée' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Met à jour un produit
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id, 10);
    const changes = await Product.update(id, {
      name: req.body.name,
      description: req.body.description || null,
      category_id: req.body.category_id || null,
      supplier_id: req.body.supplier_id || null,
      price: req.body.price,
      quantity: req.body.quantity,
      alert_threshold: req.body.alert_threshold,
    });
    if (!changes) return res.status(404).json({ message: 'Produit non trouvé' });
    const updated = await Product.findById(id);
    res.json(updated);
  } catch (error) {
    if (error && error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ message: 'Contrainte de base de données violée' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Supprime un produit
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deleteProduct(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const changes = await Product.delete(id);
    if (!changes) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Recherche des produits
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function searchProducts(req, res) {
  try {
    const q = (req.query.q || '').toString();
    const results = await Product.search(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
