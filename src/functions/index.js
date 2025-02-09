const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const singleSyncRoutes = require('./routes/singleSyncRoutes');
const bulkSyncRoutes = require('./routes/bulkSyncRoutes');
const backgroundsyncRoutes = require('./routes/backgroundsyncRoutes');
const pubSubService = require('./services/pubSubService');

// Inicializar Firebase Admin
const admin = require('firebase-admin');
if (!admin.apps.length) {
  if (process.env.NODE_ENV === 'production') {
    // Configuración específica para producción
    const serviceAccount = {
      projectId: process.env.PROJECT_ID,
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.PROJECT_ID
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
app.use('/backgroundsync', backgroundsyncRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Inicializar el subscriber de Pub/Sub
pubSubService.initializeSubscriber();

// Exportar la función
exports.api = functions.https.onRequest(app);