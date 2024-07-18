import type { NextApiRequest, NextApiResponse } from "next";
import { communityClient } from "@/clients/community";

export interface CommunitySlug {
  communitySlug: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { communitySlug }: CommunitySlug = req.body;

  try {
    const response = await communityClient.thread({ slug: communitySlug });

    if (!response || !response.data) {
      return res.status(400).json({ error: 'Error fetching thread data' });
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching thread data:', error);
    res.status(500).json({ error: 'Error fetching thread data' });
  }
};
