const env = process.env.NODE_ENV || 'development';

let config;

if (env === 'production') {
  config = require('./production'); // Load production config 
} else if (env === 'development') {
  config = require('./development'); // Load development config 
} else {
  throw new Error(`Unknown environment: ${env}`);
}

// Export the selected config
module.exports = config;
