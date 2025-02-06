const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const singleSyncRoutes = require('./routes/singleSyncRoutes');
const bulkSyncRoutes = require('./routes/bulkSyncRoutes');

// Inicializar Firebase Admin
const admin = require('firebase-admin');
if (!admin.apps.length) {
  if (process.env.NODE_ENV === 'production') {
    // Configuración específica para producción
    admin.initializeApp({
      credential: admin.credential.cert(config.firebase.credential),
      projectId: config.firebase.projectId
    });
  } else if (process.env.FUNCTIONS_EMULATOR) {
    // Configuración para el emulador
    admin.initializeApp({
      projectId: config.firebase.projectId,
      credential: admin.credential.applicationDefault()
    });
  } else {
    // Configuración por defecto
    admin.initializeApp();
  }
}

const app = express();
app.use(bodyParser.json());

// Ruta básica
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Firebase-HubSpot Sync Service',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Montar las rutas
app.use('/single-sync', singleSyncRoutes);
app.use('/bulk-sync', bulkSyncRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Exportar la función
exports.api = functions.https.onRequest(app);