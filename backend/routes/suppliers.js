const express = require('express');
const { check } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');
const {
  listSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');

const router = express.Router();

// GET /api/suppliers - Lister tous les fournisseurs
router.get('/', listSuppliers);

// GET /api/suppliers/:id - Obtenir un fournisseur
router.get('/:id', getSupplier);

// POST /api/suppliers - Créer un fournisseur (admin)
router.post(
  '/',
  auth,
  isAdmin,
  [
    check('name', "Le nom du fournisseur est requis").trim().not().isEmpty(),
    check('contact').optional().isString(),
    check('email').optional().isEmail(),
    check('phone').optional().isString(),
    check('address').optional().isString(),
  ],
  createSupplier
);

// PUT /api/suppliers/:id - Modifier un fournisseur (admin)
router.put(
  '/:id',
  auth,
  isAdmin,
  [
    check('name', "Le nom du fournisseur est requis").trim().not().isEmpty(),
    check('contact').optional().isString(),
    check('email').optional().isEmail(),
    check('phone').optional().isString(),
    check('address').optional().isString(),
  ],
  updateSupplier
);

// DELETE /api/suppliers/:id - Supprimer un fournisseur (admin)
router.delete('/:id', auth, isAdmin, deleteSupplier);

module.exports = router;
