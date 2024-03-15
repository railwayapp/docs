import client from 'prom-client';

const register = new client.Registry();

const replicaId = process.env.RAILWAY_REPLICA_ID ? process.env.RAILWAY_REPLICA_ID.slice(0, 8) : 'none';

register.setDefaultLabels({
  app: "railway-docs",
  replica: replicaId,
});

client.collectDefaultMetrics({ register });

export const promRegister = register;