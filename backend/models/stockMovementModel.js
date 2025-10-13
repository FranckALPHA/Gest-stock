/**
 * Modèle StockMovement - Gestion des mouvements de stock
 */
const db = require('../config/db');
const Product = require('./productModel');

const StockMovement = {
  /**
   * Crée un nouveau mouvement de stock et met à jour la quantité du produit
   * @param {Object} movement - Données du mouvement
   * @returns {Promise} - Promesse avec l'ID du mouvement créé
   */
  create: (movement) => {
    return new Promise((resolve, reject) => {
      // Vérifier que le type est valide ('in' ou 'out')
      if (movement.type !== 'in' && movement.type !== 'out') {
        return reject(new Error("Le type de mouvement doit être 'in' ou 'out'"));
      }

      // Vérifier que la quantité est positive
      if (movement.quantity <= 0) {
        return reject(new Error("La quantité doit être positive"));
      }

      // Commencer une transaction
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Récupérer la quantité actuelle du produit
        Product.findById(movement.product_id)
          .then(product => {
            if (!product) {
              db.run('ROLLBACK');
              return reject(new Error("Produit non trouvé"));
            }

            let newQuantity;
            if (movement.type === 'in') {
              newQuantity = product.quantity + movement.quantity;
            } else { // 'out'
              if (product.quantity < movement.quantity) {
                db.run('ROLLBACK');
                return reject(new Error("Stock insuffisant"));
              }
              newQuantity = product.quantity - movement.quantity;
            }

            // Mettre à jour la quantité du produit
            Product.updateQuantity(movement.product_id, newQuantity)
              .then(() => {
                // Créer le mouvement de stock
                const sql = `INSERT INTO stock_movements (product_id, type, quantity, note, user_id) 
                            VALUES (?, ?, ?, ?, ?)`;
                db.run(sql, [
                  movement.product_id,
                  movement.type,
                  movement.quantity,
                  movement.note || null,
                  movement.user_id || null
                ], function(err) {
                  if (err) {
                    db.run('ROLLBACK');
                    return reject(err);
                  }
                  
                  db.run('COMMIT');
                  resolve(this.lastID);
                });
              })
              .catch(err => {
                db.run('ROLLBACK');
                reject(err);
              });
          })
          .catch(err => {
            db.run('ROLLBACK');
            reject(err);
          });
      });
    });
  },

  /**
   * Récupère un mouvement de stock par son ID
   * @param {Number} id - ID du mouvement
   * @returns {Promise} - Promesse avec les données du mouvement
   */
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT sm.*, p.name as product_name, u.username as user_name
        FROM stock_movements sm
        JOIN products p ON sm.product_id = p.id
        LEFT JOIN users u ON sm.user_id = u.id
        WHERE sm.id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  /**
   * Récupère tous les mouvements de stock
   * @returns {Promise} - Promesse avec la liste des mouvements
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT sm.*, p.name as product_name, u.username as user_name
        FROM stock_movements sm
        JOIN products p ON sm.product_id = p.id
        LEFT JOIN users u ON sm.user_id = u.id
        ORDER BY sm.date DESC`;
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  /**
   * Récupère les mouvements de stock d'un produit
   * @param {Number} productId - ID du produit
   * @returns {Promise} - Promesse avec la liste des mouvements
   */
  findByProductId: (productId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT sm.*, p.name as product_name, u.username as user_name
        FROM stock_movements sm
        JOIN products p ON sm.product_id = p.id
        LEFT JOIN users u ON sm.user_id = u.id
        WHERE sm.product_id = ?
        ORDER BY sm.date DESC`;
      db.all(sql, [productId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};

module.exports = StockMovement;