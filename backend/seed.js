/**
 * Script de seed pour la base de données de gestion de stock
 * Utilisation : node seed.js
 */
const db = require('./config/db');
const bcrypt = require('bcrypt');

// Fonction utilitaire pour exécuter des requêtes SQL
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Fonction utilitaire pour exécuter des requêtes SELECT
function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Fonction principale de seed
async function seedDatabase() {
  try {
    console.log('🌱 Démarrage du seeding de la base de données...');

    // 1. Créer les utilisateurs
    console.log('👥 Création des utilisateurs...');

    // Utilisateur admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await runQuery(
      'INSERT OR IGNORE INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
      ['admin', adminPassword, 'admin@stock.com', 'admin']
    );

    // Utilisateur ordinaire
    const userPassword = await bcrypt.hash('user123', 10);
    await runQuery(
      'INSERT OR IGNORE INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
      ['user', userPassword, 'user@stock.com', 'user']
    );

    console.log('✅ Utilisateurs créés : admin (admin123) et user (user123)');

    // 2. Créer des catégories
    console.log('📂 Création des catégories...');
    await runQuery('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)', ['Électronique', 'Produits électroniques']);
    await runQuery('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)', ['Livres', 'Livres et manuels']);
    await runQuery('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)', ['Vêtements', 'Articles vestimentaires']);

    console.log('✅ Catégories créées');

    // 3. Créer des fournisseurs
    console.log('🏭 Création des fournisseurs...');
    await runQuery('INSERT OR IGNORE INTO suppliers (name, contact, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      ['TechCorp', 'Jean Dupont', 'contact@techcorp.com', '01-23-45-67-89', '123 Rue de la Tech, Paris']);
    await runQuery('INSERT OR IGNORE INTO suppliers (name, contact, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      ['BookWorld', 'Marie Martin', 'info@bookworld.com', '01-98-76-54-32', '456 Avenue des Livres, Lyon']);
    await runQuery('INSERT OR IGNORE INTO suppliers (name, contact, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      ['FashionPlus', 'Pierre Durand', 'sales@fashionplus.com', '01-11-22-33-44', '789 Boulevard Mode, Marseille']);

    console.log('✅ Fournisseurs créés');

    // 4. Créer des produits avec différents niveaux de stock
    console.log('📦 Création des produits...');

    // Produits en stock normal
    await runQuery('INSERT OR IGNORE INTO products (name, description, category_id, supplier_id, price, quantity, alert_threshold) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['Ordinateur Portable', 'PC portable 15 pouces', 1, 1, 999.99, 20, 5]);
    await runQuery('INSERT OR IGNORE INTO products (name, description, category_id, supplier_id, price, quantity, alert_threshold) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['Livre JavaScript', 'Guide complet JavaScript', 2, 2, 29.99, 50, 10]);
    await runQuery('INSERT OR IGNORE INTO products (name, description, category_id, supplier_id, price, quantity, alert_threshold) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['T-shirt Coton', 'T-shirt 100% coton', 3, 3, 19.99, 100, 20]);

    // Produits en stock faible (pour tester les alertes)
    await runQuery('INSERT OR IGNORE INTO products (name, description, category_id, supplier_id, price, quantity, alert_threshold) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['Clé USB 32GB', 'Clé USB haute vitesse', 1, 1, 15.99, 2, 5]);  // quantity < alert_threshold
    await runQuery('INSERT OR IGNORE INTO products (name, description, category_id, supplier_id, price, quantity, alert_threshold) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['Manuel SQL', 'Apprendre SQL en 21 jours', 2, 2, 39.99, 1, 3]);  // quantity < alert_threshold

    console.log('✅ Produits créés (incluant des produits en stock faible pour les tests)');

    // 5. Créer des mouvements de stock
    console.log('📈 Création des mouvements de stock...');

    // Mouvements pour les produits
    const movements = [
      { product_id: 1, type: 'in', quantity: 10, note: 'Arrivage initial' },
      { product_id: 2, type: 'in', quantity: 25, note: 'Nouveau stock' },
      { product_id: 3, type: 'in', quantity: 50, note: 'Réassort' },
      { product_id: 4, type: 'in', quantity: 5, note: 'Petit arrivage' },
      { product_id: 5, type: 'in', quantity: 3, note: 'Livraison' },
      { product_id: 1, type: 'out', quantity: 2, note: 'Vente' },
      { product_id: 2, type: 'out', quantity: 5, note: 'Commande client' },
    ];

    for (const movement of movements) {
      await runQuery(
        'INSERT INTO stock_movements (product_id, type, quantity, note, user_id) VALUES (?, ?, ?, ?, ?)',
        [movement.product_id, movement.type, movement.quantity, movement.note, 1]  // user_id = 1 (admin)
      );
    }

    console.log('✅ Mouvements de stock créés');

    console.log('🎉 Seeding terminé avec succès !');
    console.log('\n📋 Résumé des données créées :');
    console.log('- Utilisateurs : admin (admin123), user (user123)');
    console.log('- Catégories : Électronique, Livres, Vêtements');
    console.log('- Fournisseurs : TechCorp, BookWorld, FashionPlus');
    console.log('- Produits : 5 produits (dont 2 en stock faible)');
    console.log('- Mouvements : 7 mouvements de stock');
    console.log('\n🔗 Vous pouvez maintenant tester l\'application avec ces données !');

  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error.message);
    process.exit(1);
  }
}

// Exécuter le seeding si le script est appelé directement
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = { seedDatabase };
