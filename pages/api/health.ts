import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const projectRef = url.split('https://')[1]?.split('.')[0] || '';
  res.status(200).json({ ok: true, projectRef });
}
