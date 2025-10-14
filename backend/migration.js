/**
 * Script de migration pour ajouter le champ is_active à la table users
 * Utilisation : node migration.js
 */
const db = require('./config/db');

async function addIsActiveColumn() {
  try {
    console.log('🔄 Ajout du champ is_active à la table users...');

    // Ajouter la colonne is_active avec une valeur par défaut de 1 (actif)
    await new Promise((resolve, reject) => {
      db.run('ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1', (err) => {
        if (err) {
          if (err.message.includes('duplicate column name')) {
            console.log('✅ Le champ is_active existe déjà');
            resolve();
          } else {
            reject(err);
          }
        } else {
          console.log('✅ Champ is_active ajouté avec succès');
          resolve();
        }
      });
    });

    // Mettre à jour tous les utilisateurs existants pour qu'ils soient actifs
    await new Promise((resolve, reject) => {
      db.run('UPDATE users SET is_active = 1 WHERE is_active IS NULL', (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Tous les utilisateurs existants sont maintenant actifs');
          resolve();
        }
      });
    });

    console.log('🎉 Migration terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error.message);
    process.exit(1);
  }
}

// Exécuter la migration si le script est appelé directement
if (require.main === module) {
  addIsActiveColumn().then(() => process.exit(0));
}

module.exports = { addIsActiveColumn };
