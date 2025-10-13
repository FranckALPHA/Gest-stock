const axios = require('axios');

// URL de base de l'API
const API_URL = 'http://localhost:5000/api';

/**
 * Test des fonctionnalités d'authentification
 */
async function testAuth() {
  try {
    console.log('=== Test des fonctionnalités d\'authentification ===');
    
    // Test de l'inscription
    console.log('\n1. Test de l\'inscription:');
    const username = `testuser_${Date.now()}`;
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      username,
      password: 'password123',
      email: `${username}@example.com`,
      role: 'user'
    });
    
    console.log(`Statut: ${registerResponse.status}`);
    console.log('Réponse:', registerResponse.data);
    
    // Récupérer le token de l'inscription (pour info) puis utiliser celui de la connexion pour les routes protégées
    let token = registerResponse.data.token;
    
    // Test de la connexion
    console.log('\n2. Test de la connexion:');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username,
      password: 'password123'
    });
    
    console.log(`Statut: ${loginResponse.status}`);
    console.log('Réponse:', loginResponse.data);
    // Utiliser le token de la connexion pour les endpoints protégés
    token = loginResponse.data.token;
    
    // Test de la récupération du profil
    console.log('\n3. Test de la récupération du profil:');
    const profileResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log(`Statut: ${profileResponse.status}`);
    console.log('Réponse:', profileResponse.data);
    
    console.log('\n=== Tests réussis ===');
  } catch (error) {
    console.error('\n=== Erreur lors des tests ===');
    if (error.response) {
      console.error(`Statut: ${error.response.status}`);
      console.error('Réponse:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Exécuter les tests
testAuth();