import client from 'prom-client';

const register = new client.Registry();

const replicaId = process.env.RAILWAY_REPLICA_ID || 'unknown';

register.setDefaultLabels({
  app: "railway-docs",
  replica_id: replicaId,
});

client.collectDefaultMetrics({ register });

export const promRegister = register;

