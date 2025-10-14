const { validationResult } = require('express-validator');
const Supplier = require('../models/supplierModel');

/**
 * Liste tous les fournisseurs (avec recherche et pagination)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function listSuppliers(req, res) {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const result = await Supplier.findAllWithSearchAndPagination(
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
 * Récupère un fournisseur par ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getSupplier(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const supplier = await Supplier.findById(id);
    if (!supplier) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Crée un nouveau fournisseur
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function createSupplier(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = await Supplier.create({
      name: req.body.name,
      contact: req.body.contact || null,
      email: req.body.email || null,
      phone: req.body.phone || null,
      address: req.body.address || null,
    });
    const created = await Supplier.findById(id);
    res.status(201).json(created);
  } catch (error) {
    if (error && error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ message: 'Le fournisseur existe déjà' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Met à jour un fournisseur
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateSupplier(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = parseInt(req.params.id, 10);
    const changes = await Supplier.update(id, {
      name: req.body.name,
      contact: req.body.contact || null,
      email: req.body.email || null,
      phone: req.body.phone || null,
      address: req.body.address || null,
    });
    if (!changes) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    const updated = await Supplier.findById(id);
    res.json(updated);
  } catch (error) {
    if (error && error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ message: 'Conflit de contrainte' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Supprime un fournisseur
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deleteSupplier(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const changes = await Supplier.delete(id);
    if (!changes) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    res.json({ message: 'Fournisseur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  listSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
