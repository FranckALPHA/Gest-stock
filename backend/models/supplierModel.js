/**
 * Modèle Supplier - Gestion des fournisseurs
 */
const db = require('../config/db');

const Supplier = {
  /**
   * Crée un nouveau fournisseur
   * @param {Object} supplier - Données du fournisseur
   * @returns {Promise} - Promesse avec l'ID du fournisseur créé
   */
  create: (supplier) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO suppliers (name, contact, email, phone, address) 
                  VALUES (?, ?, ?, ?, ?)`;
      db.run(sql, [
        supplier.name, 
        supplier.contact, 
        supplier.email, 
        supplier.phone, 
        supplier.address
      ], function(err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  },

  /**
   * Récupère un fournisseur par son ID
   * @param {Number} id - ID du fournisseur
   * @returns {Promise} - Promesse avec les données du fournisseur
   */
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM suppliers WHERE id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  /**
   * Récupère tous les fournisseurs
   * @returns {Promise} - Promesse avec la liste des fournisseurs
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM suppliers`;
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  /**
   * Met à jour un fournisseur
   * @param {Number} id - ID du fournisseur
   * @param {Object} supplier - Nouvelles données du fournisseur
   * @returns {Promise} - Promesse avec le nombre de lignes modifiées
   */
  update: (id, supplier) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE suppliers 
                  SET name = ?, contact = ?, email = ?, phone = ?, address = ? 
                  WHERE id = ?`;
      db.run(sql, [
        supplier.name, 
        supplier.contact, 
        supplier.email, 
        supplier.phone, 
        supplier.address, 
        id
      ], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },

  /**
   * Supprime un fournisseur
   * @param {Number} id - ID du fournisseur
   * @returns {Promise} - Promesse avec le nombre de lignes supprimées
   */
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM suppliers WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }
};

module.exports = Supplier;