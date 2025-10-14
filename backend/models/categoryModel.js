/**
 * Modèle Category - Gestion des catégories de produits
 */
const db = require('../config/db');

const Category = {
  /**
   * Crée une nouvelle catégorie
   * @param {Object} category - Données de la catégorie
   * @returns {Promise} - Promesse avec l'ID de la catégorie créée
   */
  create: (category) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO categories (name, description) VALUES (?, ?)`;
      db.run(sql, [category.name, category.description], function(err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  },

  /**
   * Récupère une catégorie par son ID
   * @param {Number} id - ID de la catégorie
   * @returns {Promise} - Promesse avec les données de la catégorie
   */
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM categories WHERE id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  /**
   * Récupère toutes les catégories avec recherche
   * @param {String} search - Terme de recherche
   * @returns {Promise} - Promesse avec la liste des catégories filtrées
   */
  findAllWithSearch: (search = '') => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM categories WHERE name LIKE ? OR description LIKE ?`;
      const searchTerm = `%${search}%`;
      db.all(sql, [searchTerm, searchTerm], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  /**
   * Récupère toutes les catégories avec pagination
   * @param {Number} page - Numéro de page (1-based)
   * @param {Number} limit - Nombre d'éléments par page
   * @returns {Promise} - Promesse avec les catégories et métadonnées
   */
  findAllPaginated: (page = 1, limit = 10) => {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      const sql = `SELECT * FROM categories LIMIT ? OFFSET ?`;
      const countSql = 'SELECT COUNT(*) as total FROM categories';

      db.all(sql, [limit, offset], (err, rows) => {
        if (err) return reject(err);
        db.get(countSql, [], (err, countRow) => {
          if (err) return reject(err);
          resolve({
            categories: rows,
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
   * Récupère toutes les catégories avec recherche et pagination
   * @param {String} search - Terme de recherche
   * @param {Number} page - Numéro de page
   * @param {Number} limit - Nombre d'éléments par page
   * @returns {Promise} - Promesse avec les catégories filtrées et métadonnées
   */
  findAllWithSearchAndPagination: (search = '', page = 1, limit = 10) => {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      const searchTerm = `%${search}%`;
      const sql = `SELECT * FROM categories WHERE name LIKE ? OR description LIKE ? LIMIT ? OFFSET ?`;
      const countSql = `SELECT COUNT(*) as total FROM categories WHERE name LIKE ? OR description LIKE ?`;

      db.all(sql, [searchTerm, searchTerm, limit, offset], (err, rows) => {
        if (err) return reject(err);
        db.get(countSql, [searchTerm, searchTerm], (err, countRow) => {
          if (err) return reject(err);
          resolve({
            categories: rows,
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
   * Récupère toutes les catégories
   * @returns {Promise} - Promesse avec la liste des catégories
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM categories`;
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  /**
   * Met à jour une catégorie
   * @param {Number} id - ID de la catégorie
   * @param {Object} category - Nouvelles données de la catégorie
   * @returns {Promise} - Promesse avec le nombre de lignes modifiées
   */
  update: (id, category) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE categories SET name = ?, description = ? WHERE id = ?`;
      db.run(sql, [category.name, category.description, id], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },

  /**
   * Supprime une catégorie
   * @param {Number} id - ID de la catégorie
   * @returns {Promise} - Promesse avec le nombre de lignes supprimées
   */
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM categories WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }
};

module.exports = Category;