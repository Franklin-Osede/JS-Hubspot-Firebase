const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
require('dotenv').config(); // Cargar variables de entorno locales si existen

// 📌 Definir explícitamente el entorno como producción
const MODE = "production";

console.log("🔥 Entorno actual:", MODE);

// 📌 Detener la ejecución si no está en producción
if (MODE !== "production") {
  console.log("⚠️ Advertencia: Estás en desarrollo. La sincronización no se ejecutará.");
  process.exit(1);
}

// 📌 Definir la URL correcta de Firebase Functions para producción
const BASE_URL = "https://us-central1-domoblock-dapp.cloudfunctions.net/api/bulk-sync";
const CSV_FILE = "./emails_hubspot.csv"; // Ruta del archivo CSV
const BATCH_SIZE = 100; // Cantidad de emails por batch
const WAIT_TIME = 3000; // Espera entre requests (en milisegundos)

// 📌 Función para leer emails desde el CSV
const readEmailsFromCSV = async () => {
  return new Promise((resolve, reject) => {
    const emails = [];
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => {
        if (row.email) emails.push(row.email.trim());
      })
      .on('end', () => resolve(emails))
      .on('error', (error) => reject(error));
  });
};

// 📌 Función para dividir emails en batches
const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
};

// 📌 Función principal para sincronizar emails
const syncEmailsInBatches = async () => {
  try {
    const emails = await readEmailsFromCSV();
    const batches = chunkArray(emails, BATCH_SIZE);

    console.log(`🚀 Iniciando sincronización en ${batches.length} batches...`);

    for (let i = 0; i < batches.length; i++) {
      console.log(`📤 Enviando batch ${i + 1}/${batches.length}...`);

      try {
        const response = await axios.post(BASE_URL, { emails: batches[i] });
        console.log(`✅ Batch ${i + 1} completado:`, response.data);
      } catch (error) {
        console.error(`❌ Error en batch ${i + 1}:`, error.response?.data || error.message);
      }

      console.log(`⏳ Esperando ${WAIT_TIME / 1000} segundos antes del próximo batch...`);
      await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
    }

    console.log("🎉 ¡Sincronización completa!");
  } catch (error) {
    console.error("❌ Error general:", error);
  }
};

// 📌 Ejecutar el script
syncEmailsInBatches();
