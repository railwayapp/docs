import { NextApiRequest, NextApiResponse } from 'next';
import client from "prom-client";

const register = new client.Registry();

const replicaId = process.env.RAILWAY_REPLICA_ID || 'unknown';

register.setDefaultLabels({
  app: "railway-docs",
  replica_id: replicaId,
});

client.collectDefaultMetrics({ register });

console.log(client.collectDefaultMetrics.metricsList)

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-type', register.contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.send(await register.metrics());
}
