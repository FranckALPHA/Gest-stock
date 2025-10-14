const Product = require('../models/productModel');
const StockMovement = require('../models/stockMovementModel');

/**
 * Retourne des statistiques générales du stock
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getStats(req, res) {
  try {
    const products = await Product.findAll();
    const movements = await StockMovement.findAll();

    const totalProducts = products.length;
    const totalQuantity = products.reduce((acc, p) => acc + (p.quantity || 0), 0);
    const totalValue = products.reduce((acc, p) => acc + (p.price * (p.quantity || 0)), 0);

    res.json({ totalProducts, totalQuantity, totalValue });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Retourne la liste des produits en alerte (stock <= seuil)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getAlerts(req, res) {
  try {
    const low = await Product.getLowStock();
    res.json(low);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Retourne les mouvements récents de stock
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getRecentMovements(req, res) {
  try {
    const moves = await StockMovement.findAll();
    res.json(moves.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  getStats,
  getAlerts,
  getRecentMovements,
};
