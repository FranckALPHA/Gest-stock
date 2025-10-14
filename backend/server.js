// Nettoyer le cache des modules
Object.keys(require.cache).forEach(function(key) {
  if (key.includes('.env')) {
    delete require.cache[key];
  }
});

// Charger dotenv en premier
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const stockMovementRoutes = require('./routes/stockMovements');
const dashboardRoutes = require('./routes/dashboard');
const supplierRoutes = require('./routes/suppliers');
const userRoutes = require('./routes/users');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000; // Valeur par défaut 5000

// Logs de débogage
console.log('Fichier .env chargé depuis :', path.resolve(__dirname, '../.env'));
console.log('Toutes les variables d\'environnement :', Object.keys(process.env).filter(key => key === 'PORT'));
console.log('Valeur de PORT :', PORT);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/users', userRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API de gestion de stock opérationnelle' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});