const { validationResult } = require('express-validator');
const StockMovement = require('../models/stockMovementModel');

/**
 * Liste tous les mouvements de stock
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function listStockMovements(req, res) {
  try {
    const moves = await StockMovement.findAll();
    res.json(moves);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Récupère un mouvement de stock par ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getStockMovement(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const move = await StockMovement.findById(id);
    if (!move) return res.status(404).json({ message: 'Mouvement non trouvé' });
    res.json(move);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Récupère l'historique des mouvements pour un produit
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getMovementsByProduct(req, res) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const moves = await StockMovement.findByProductId(productId);
    res.json(moves);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Crée un mouvement de stock (entrée/sortie) et met à jour la quantité produit
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function createStockMovement(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = await StockMovement.create({
      product_id: req.body.product_id,
      type: req.body.type.toLowerCase(),
      quantity: req.body.quantity,
      note: req.body.note || null,
      user_id: req.user?.user_id || null,
    });
    const created = await StockMovement.findById(id);
    res.status(201).json(created);
  } catch (error) {
    const msg = error?.message || 'Erreur serveur';
    if (msg.includes('Stock insuffisant') || msg.includes('Produit non trouvé') || msg.includes("Le type de mouvement")) {
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  listStockMovements,
  getStockMovement,
  getMovementsByProduct,
  createStockMovement,
};
