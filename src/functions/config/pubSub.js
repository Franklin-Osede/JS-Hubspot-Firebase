// src/functions/config/pubsub.js
const { PubSub } = require('@google-cloud/pubsub');
const config = require('./index');

const TOPIC_NAME = 'hubspot-sync-topic';
const SUBSCRIPTION_NAME = 'hubspot-sync-subscription';
const BATCH_SIZE = 100;
const DELAY_BETWEEN_BATCHES = 45000;

const pubsub = new PubSub({
  projectId: config.firebase.projectId,
  credentials: {
    client_email: config.firebase.clientEmail,
    private_key: config.firebase.privateKey
  }
});

module.exports = {
  pubsub,
  TOPIC_NAME,
  SUBSCRIPTION_NAME,
  BATCH_SIZE,
  DELAY_BETWEEN_BATCHES
};