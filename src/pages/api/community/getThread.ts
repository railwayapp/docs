import type { NextApiRequest, NextApiResponse } from "next";
import { communityClient } from "@/clients/community";

export interface CommunitySlug {
  communitySlug: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { communitySlug }: CommunitySlug = req.body;

    const { data } = await communityClient.thread({ slug: communitySlug });

    res.status(200).json(data);
  }
};
