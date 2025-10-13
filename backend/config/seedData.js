/**
 * Script pour initialiser les données de test
 */
const bcrypt = require('bcrypt');
const db = require('./db');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Supplier = require('../models/supplierModel');
const Product = require('../models/productModel');

/**
 * Initialise les données de test
 */
const seedData = async () => {
  try {
    console.log('Initialisation des données de test...');

    // Créer un utilisateur admin par défaut
    const adminExists = await User.findByUsername('admin');
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'admin'
      });
      console.log('✅ Utilisateur admin créé');
    } else {
      console.log('⚠️ Utilisateur admin existe déjà');
    }

    // Créer quelques catégories
    const categories = [
      { name: 'Électronique', description: 'Produits électroniques et gadgets' },
      { name: 'Bureautique', description: 'Fournitures de bureau' },
      { name: 'Mobilier', description: 'Meubles et équipements' }
    ];

    for (const category of categories) {
      await Category.create(category);
    }
    console.log('✅ Catégories créées');

    // Créer quelques fournisseurs
    const suppliers = [
      { name: 'TechSupply', contact: 'contact@techsupply.com', phone: '0123456789' },
      { name: 'OfficePro', contact: 'info@officepro.com', phone: '0987654321' },
      { name: 'FurniturePlus', contact: 'sales@furnitureplus.com', phone: '0567891234' }
    ];

    for (const supplier of suppliers) {
      await Supplier.create(supplier);
    }
    console.log('✅ Fournisseurs créés');

    // Créer quelques produits
    const products = [
      { 
        name: 'Ordinateur portable', 
        description: 'Ordinateur portable 15 pouces', 
        category_id: 1, 
        supplier_id: 1, 
        price: 899.99, 
        quantity: 10, 
        alert_threshold: 3 
      },
      { 
        name: 'Imprimante laser', 
        description: 'Imprimante laser noir et blanc', 
        category_id: 1, 
        supplier_id: 1, 
        price: 249.99, 
        quantity: 5, 
        alert_threshold: 2 
      },
      { 
        name: 'Stylos (boîte)', 
        description: 'Boîte de 10 stylos bleus', 
        category_id: 2, 
        supplier_id: 2, 
        price: 4.99, 
        quantity: 50, 
        alert_threshold: 10 
      },
      { 
        name: 'Chaise de bureau', 
        description: 'Chaise ergonomique', 
        category_id: 3, 
        supplier_id: 3, 
        price: 149.99, 
        quantity: 8, 
        alert_threshold: 2 
      }
    ];

    for (const product of products) {
      await Product.create(product);
    }
    console.log('✅ Produits créés');

    console.log('✅ Initialisation des données terminée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des données:', error);
    return false;
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Script terminé');
      process.exit(0);
    })
    .catch(err => {
      console.error('Erreur:', err);
      process.exit(1);
    });
}

module.exports = seedData;