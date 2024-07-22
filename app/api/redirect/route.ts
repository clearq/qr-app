import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID is required!' });
  }

  try {
    
    const qrData = await prisma.qr.findUnique({
      where: { id },
      select: { url: true },
    });

    if (!qrData) {
      return res.status(404).json({ error: 'Not found!' });
    }

    return res.status(200).json(qrData);
  } catch (error) {
    console.error('Error fetching QR code data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
