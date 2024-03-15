import { NextApiRequest, NextApiResponse } from 'next';
import { promRegister } from '@/clients/prom-client';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-type', promRegister.contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.send(await promRegister.metrics());
}