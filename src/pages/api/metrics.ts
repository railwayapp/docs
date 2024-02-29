import { NextApiRequest, NextApiResponse } from 'next';
import client from "prom-client";

const register = new client.Registry();

register.setDefaultLabels({
  app: "railway-docs",
});

client.collectDefaultMetrics({ register });

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-type', register.contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.send(await register.metrics());
}
