const express = require('express');
const config = require('./config');
const { singleSync } = require('./services/singleSync');
const { bulkSync } = require('./services/bulkSync');

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Ruta para verificar el estado del servicio
app.get('/', (req, res) => {
  res.send({
    message: 'Firebase-HubSpot Sync Service',
    projectId: config.firebase.projectId,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta para sincronizar un usuario específico
app.post('/sync/single', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ error: 'Email is required' });
  }

  try {
    const result = await singleSync(email);
    res.send(result);
  } catch (error) {
    console.error('Error during single sync:', error);
    res.status(500).send({ error: 'Failed to sync single user' });
  }
});

// Ruta para sincronizar todos los usuarios
app.post('/sync/bulk', async (req, res) => {
  try {
    const result = await bulkSync();
    res.send(result);
  } catch (error) {
    console.error('Error during bulk sync:', error);
    res.status(500).send({ error: 'Failed to perform bulk sync' });
  }
});

// Escuchar en el puerto configurado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Firebase Project ID: ${config.firebase.projectId}`);
});
