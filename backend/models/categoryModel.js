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