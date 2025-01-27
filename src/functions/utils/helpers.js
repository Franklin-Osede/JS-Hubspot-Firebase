/**
 * Formatea un email a minúsculas para consistencia.
 * @param {string} email - El email a formatear.
 * @returns {string} - El email en minúsculas.
 */
const formatEmail = (email) => {
  if (!email) return null;
  return email.trim().toLowerCase();
};

/**
 * Maneja errores y devuelve una respuesta consistente.
 * @param {Error} error - El error capturado.
 * @returns {object} - Objeto con detalles del error.
 */
const handleError = (error) => {
  console.error('Error:', error.message);
  return {
    success: false,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  };
};

/**
 * Devuelve una fecha en formato ISO actual.
 * @returns {string} - Fecha actual en formato ISO.
 */
const getCurrentISODate = () => {
  return new Date().toISOString();
};

/**
 * Valida si un objeto tiene todas las propiedades requeridas.
 * @param {object} obj - El objeto a validar.
 * @param {Array<string>} properties - Las propiedades requeridas.
 * @returns {boolean} - `true` si todas las propiedades existen, `false` si falta alguna.
 */
const validateProperties = (obj, properties) => {
  return properties.every((property) => obj.hasOwnProperty(property));
};

module.exports = {
  formatEmail,
  handleError,
  getCurrentISODate,
  validateProperties,
};
