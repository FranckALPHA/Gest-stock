const express = require('express');
const cors = require('cors');
const path = require('path');
// Charger les variables d'environnement depuis le .env
require('dotenv').config();
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const stockMovementRoutes = require('./routes/stockMovements');
const dashboardRoutes = require('./routes/dashboard');
const supplierRoutes = require('./routes/suppliers');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

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

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API de gestion de stock opérationnelle' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});