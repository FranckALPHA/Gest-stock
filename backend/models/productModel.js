/**
 * Modèle Product - Gestion des produits
 */
const db = require('../config/db');

const Product = {
  /**
   * Crée un nouveau produit
   * @param {Object} product - Données du produit
   * @returns {Promise} - Promesse avec l'ID du produit créé
   */
  create: (product) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO products (name, description, category_id, supplier_id, price, quantity, alert_threshold) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`;
      db.run(sql, [
        product.name, 
        product.description, 
        product.category_id, 
        product.supplier_id, 
        product.price, 
        product.quantity || 0, 
        product.alert_threshold || 10
      ], function(err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  },

  /**
   * Récupère un produit par son ID
   * @param {Number} id - ID du produit
   * @returns {Promise} - Promesse avec les données du produit
   */
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, c.name as category_name, s.name as supplier_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE p.id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  /**
   * Récupère tous les produits
   * @returns {Promise} - Promesse avec la liste des produits
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, c.name as category_name, s.name as supplier_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id`;
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  /**
   * Met à jour un produit
   * @param {Number} id - ID du produit
   * @param {Object} product - Nouvelles données du produit
   * @returns {Promise} - Promesse avec le nombre de lignes modifiées
   */
  update: (id, product) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE products 
                  SET name = ?, description = ?, category_id = ?, supplier_id = ?, 
                      price = ?, quantity = ?, alert_threshold = ? 
                  WHERE id = ?`;
      db.run(sql, [
        product.name, 
        product.description, 
        product.category_id, 
        product.supplier_id, 
        product.price, 
        product.quantity, 
        product.alert_threshold, 
        id
      ], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },

  /**
   * Met à jour la quantité d'un produit
   * @param {Number} id - ID du produit
   * @param {Number} quantity - Nouvelle quantité
   * @returns {Promise} - Promesse avec le nombre de lignes modifiées
   */
  updateQuantity: (id, quantity) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE products SET quantity = ? WHERE id = ?`;
      db.run(sql, [quantity, id], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },

  /**
   * Supprime un produit
   * @param {Number} id - ID du produit
   * @returns {Promise} - Promesse avec le nombre de lignes supprimées
   */
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM products WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },

  /**
   * Recherche des produits par nom ou description
   * @param {String} query - Terme de recherche
   * @returns {Promise} - Promesse avec la liste des produits correspondants
   */
  search: (query) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, c.name as category_name, s.name as supplier_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE p.name LIKE ? OR p.description LIKE ?`;
      const searchTerm = `%${query}%`;
      db.all(sql, [searchTerm, searchTerm], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  /**
   * Récupère les produits dont le stock est inférieur au seuil d'alerte
   * @returns {Promise} - Promesse avec la liste des produits en alerte
   */
  getLowStock: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, c.name as category_name, s.name as supplier_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE p.quantity <= p.alert_threshold`;
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};

module.exports = Product;