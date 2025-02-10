require('dotenv').config({ path: '.env.production' });

const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const config = require('./config');
const singleSyncRoutes = require('./routes/singleSyncRoutes');
const bulkSyncRoutes = require('./routes/bulkSyncRoutes');
const backgroundsyncRoutes = require('./routes/backgroundsyncRoutes');
const pubSubService = require('./services/pubSubService');

// ✅ Confirmation of logs from what it is loading in production
console.log(`🚀 Entorno cargado: PRODUCTION`);
console.log(`🔑 HubSpot Token: ${process.env.HUBSPOT_ACCESS_TOKEN ? "Presente" : "No presente"}`);

// 🔥 Initialize Firebase with production config
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.PROJECT_ID
  });
}

// 🚀 Initialize Express
const app = express();
app.use(bodyParser.json());

// ✅ Basic route to verify that la API is online
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Firebase-HubSpot Sync Service',
    environment: 'production'
  });
});

// 🔀 Build the routes
app.use('/single-sync', singleSyncRoutes);
app.use('/bulk-sync', bulkSyncRoutes);
app.use('/backgroundsync', backgroundsyncRoutes);

// 🚨 Middleware to manage errors
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 🎯 Initialize the Subscriber from Pub/Sub
pubSubService.initializeSubscriber();

// 🔥 Exportar la función como API
exports.api = functions.https.onRequest(app);
