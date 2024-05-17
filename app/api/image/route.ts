import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Access the file from req.body
      const imageFile = req.body.image;

      // Process the file (e.g., save it to storage)

      // Return the image URL
      res.status(200).json({ imageUrl: 'https://example.com/image.jpg' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}