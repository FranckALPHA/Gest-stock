/**
 * Script de test de la connexion à la base de données
 */
const db = require('./config/db');
const seedData = require('./config/seedData');

// Test de la connexion à la base de données
console.log('Test de la connexion à la base de données...');

db.serialize(() => {
  // Vérifier que la connexion fonctionne
  db.get('SELECT sqlite_version() as version', (err, row) => {
    if (err) {
      console.error('❌ Erreur de connexion à la base de données:', err.message);
      process.exit(1);
    }
    
    console.log(`✅ Connexion à SQLite réussie (version ${row.version})`);
    
    // Vérifier que les tables ont été créées
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        console.error('❌ Erreur lors de la vérification des tables:', err.message);
        process.exit(1);
      }
      
      console.log('✅ Tables créées:');
      tables.forEach(table => {
        if (table.name !== 'sqlite_sequence') {
          console.log(`   - ${table.name}`);
        }
      });
      
      // Initialiser les données de test
      seedData()
        .then(success => {
          if (success) {
            // Vérifier que les données ont été insérées
            Promise.all([
              new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                  if (err) reject(err);
                  else resolve({ table: 'users', count: row.count });
                });
              }),
              new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
                  if (err) reject(err);
                  else resolve({ table: 'categories', count: row.count });
                });
              }),
              new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM suppliers', (err, row) => {
                  if (err) reject(err);
                  else resolve({ table: 'suppliers', count: row.count });
                });
              }),
              new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
                  if (err) reject(err);
                  else resolve({ table: 'products', count: row.count });
                });
              })
            ])
            .then(results => {
              console.log('✅ Données insérées:');
              results.forEach(result => {
                console.log(`   - ${result.table}: ${result.count} enregistrements`);
              });
              
              console.log('✅ Test de la base de données terminé avec succès');
              process.exit(0);
            })
            .catch(err => {
              console.error('❌ Erreur lors de la vérification des données:', err.message);
              process.exit(1);
            });
          } else {
            console.error('❌ Échec de l\'initialisation des données');
            process.exit(1);
          }
        })
        .catch(err => {
          console.error('❌ Erreur lors de l\'initialisation des données:', err.message);
          process.exit(1);
        });
    });
  });
});