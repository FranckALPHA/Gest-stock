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
   * Récupère tous les fournisseurs avec recherche
   * @param {String} search - Terme de recherche
   * @returns {Promise} - Promesse avec la liste des fournisseurs filtrés
   */
  findAllWithSearch: (search = '') => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM suppliers WHERE name LIKE ? OR contact LIKE ? OR email LIKE ? OR phone LIKE ? OR address LIKE ?`;
      const searchTerm = `%${search}%`;
      db.all(sql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  /**
   * Récupère tous les fournisseurs avec pagination
   * @param {Number} page - Numéro de page (1-based)
   * @param {Number} limit - Nombre d'éléments par page
   * @returns {Promise} - Promesse avec les fournisseurs et métadonnées
   */
  findAllPaginated: (page = 1, limit = 10) => {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      const sql = `SELECT * FROM suppliers LIMIT ? OFFSET ?`;
      const countSql = 'SELECT COUNT(*) as total FROM suppliers';

      db.all(sql, [limit, offset], (err, rows) => {
        if (err) return reject(err);
        db.get(countSql, [], (err, countRow) => {
          if (err) return reject(err);
          resolve({
            suppliers: rows,
            pagination: {
              current_page: page,
              per_page: limit,
              total: countRow.total,
              total_pages: Math.ceil(countRow.total / limit)
            }
          });
        });
      });
    });
  },

  /**
   * Récupère tous les fournisseurs avec recherche et pagination
   * @param {String} search - Terme de recherche
   * @param {Number} page - Numéro de page
   * @param {Number} limit - Nombre d'éléments par page
   * @returns {Promise} - Promesse avec les fournisseurs filtrés et métadonnées
   */
  findAllWithSearchAndPagination: (search = '', page = 1, limit = 10) => {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      const searchTerm = `%${search}%`;
      const sql = `SELECT * FROM suppliers WHERE name LIKE ? OR contact LIKE ? OR email LIKE ? OR phone LIKE ? OR address LIKE ? LIMIT ? OFFSET ?`;
      const countSql = `SELECT COUNT(*) as total FROM suppliers WHERE name LIKE ? OR contact LIKE ? OR email LIKE ? OR phone LIKE ? OR address LIKE ?`;

      db.all(sql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limit, offset], (err, rows) => {
        if (err) return reject(err);
        db.get(countSql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, countRow) => {
          if (err) return reject(err);
          resolve({
            suppliers: rows,
            pagination: {
              current_page: page,
              per_page: limit,
              total: countRow.total,
              total_pages: Math.ceil(countRow.total / limit)
            }
          });
        });
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