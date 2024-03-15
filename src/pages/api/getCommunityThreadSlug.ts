import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/clients/prisma";

export interface DocsTopic {
  section: string;
  topic: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { section, topic }: DocsTopic = req.body;
  if (req.method == "POST") {
    const data = await prisma.communityThread.findFirst({
      where: {
        section: section,
        topic: topic,
      },
    });
    if (data) {
      res.status(200).json(data.communityThreadSlug)
    } else {
      res.status(200).json(null)
    }
  }
};
