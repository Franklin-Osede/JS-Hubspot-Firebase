const { pubsub, TOPIC_NAME, SUBSCRIPTION_NAME } = require('../config/pubSub');
const { syncAllUsers } = require('./bulkSyncService');
const admin = require('firebase-admin');

class PubSubService {
  async publishEmails(emails, batchSize = 100) {
    // Dividir emails en batches
    const batches = [];
    for (let i = 0; i < emails.length; i += batchSize) {
      batches.push(emails.slice(i, i + batchSize));
    }

    console.log(`Dividiendo ${emails.length} emails en ${batches.length} batches`);

    // Publicar cada batch
    for (const [index, batch] of batches.entries()) {
      const dataBuffer = Buffer.from(JSON.stringify({
        emails: batch,
        batchNumber: index + 1,
        totalBatches: batches.length
      }));

      try {
        await pubsub.topic(TOPIC_NAME).publish(dataBuffer);
        console.log(`Batch ${index + 1}/${batches.length} publicado`);
        // Esperar 45 segundos entre batches
        await new Promise(resolve => setTimeout(resolve, 45000));
      } catch (error) {
        console.error(`Error publicando batch ${index + 1}:`, error);
      }
    }
  }

  async initializeSubscriber() {
    const subscription = pubsub.subscription(SUBSCRIPTION_NAME);

    subscription.on('message', async (message) => {
      try {
        const { emails, batchNumber, totalBatches } = JSON.parse(message.data.toString());

        console.log(`Procesando batch ${batchNumber}/${totalBatches}`, {
          emailsCount: emails.length
        });

        // Usar tu función existente
        const result = await syncAllUsers(admin.firestore(), emails);

        console.log(`Batch ${batchNumber}/${totalBatches} completado:`, result);

        message.ack();
      } catch (error) {
        console.error('Error procesando batch:', error);
        message.nack();
      }
    });

    console.log('Subscriber iniciado correctamente');
  }
}

module.exports = new PubSubService();