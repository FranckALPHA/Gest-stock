/**
 * Modèle User - Gestion des utilisateurs
 */
const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  /**
   * Crée un nouvel utilisateur
   * @param {Object} user - Données de l'utilisateur
   * @returns {Promise} - Promesse avec l'ID de l'utilisateur créé
   */
  create: (user) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return reject(err);
        
        const sql = `INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)`;
        db.run(sql, [user.username, hash, user.email, user.role || 'user'], function(err) {
          if (err) return reject(err);
          const selectSql = `SELECT id, username, email, role, created_at FROM users WHERE id = ?`;
          db.get(selectSql, [this.lastID], (err2, row) => {
            if (err2) return reject(err2);
            resolve(row);
          });
        });
      });
    });
  },

  /**
   * Récupère un utilisateur par son ID
   * @param {Number} id - ID de l'utilisateur
   * @returns {Promise} - Promesse avec les données de l'utilisateur
   */
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, username, email, role, created_at FROM users WHERE id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  /**
   * Récupère un utilisateur par son nom d'utilisateur
   * @param {String} username - Nom d'utilisateur
   * @returns {Promise} - Promesse avec les données de l'utilisateur
   */
  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE username = ?`;
      db.get(sql, [username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  /**
   * Vérifie les identifiants d'un utilisateur
   * @param {String} username - Nom d'utilisateur
   * @param {String} password - Mot de passe
   * @returns {Promise} - Promesse avec les données de l'utilisateur (sans le mot de passe)
   */
  authenticate: (username, password) => {
    return new Promise((resolve, reject) => {
      User.findByUsername(username)
        .then(user => {
          if (!user) return resolve(null);
          
          bcrypt.compare(password, user.password_hash, (err, result) => {
            if (err) return reject(err);
            if (!result) return resolve(null);
            
            // Ne pas renvoyer le hash du mot de passe
            const { password_hash, ...userWithoutPassword } = user;
            resolve(userWithoutPassword);
          });
        })
        .catch(err => reject(err));
    });
  },

  /**
   * Récupère tous les utilisateurs
   * @returns {Promise} - Promesse avec la liste des utilisateurs
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, username, role, created_at FROM users`;
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};

module.exports = User;