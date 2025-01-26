const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const singleSyncRoutes = require('./routes/singleSyncRoutes');
const bulkSyncRoutes = require('./routes/bulkSyncRoutes');

// Crear la aplicación de Express
const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Middleware para logs (puedes omitirlo en producción si no es necesario)
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/api/single-sync', singleSyncRoutes);
app.use('/api/bulk-sync', bulkSyncRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Inicializar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
