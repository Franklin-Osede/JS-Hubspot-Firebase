const env = process.env.NODE_ENV || 'development';

let config;

if (env === 'production') {
  config = require('./production'); // Carga configuración de producción
} else if (env === 'development') {
  config = require('./development'); // Carga configuración de desarrollo
} else {
  throw new Error(`Unknown environment: ${env}`);
}

// Exporta la configuración seleccionada
module.exports = config;
