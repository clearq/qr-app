import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { qrId, ipAddress, latitude, longitude } = req.body;

    try {
      const scan = await prisma.scan.create({
        data: {
          qrId,
          ipAddress,
          latitude,
          longitude,
        },
      });

      res.status(200).json(scan);
    } catch (error) {
      res.status(500).json({ error: 'Failed to register scan' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
