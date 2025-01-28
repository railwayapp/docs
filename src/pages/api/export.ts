import { allPages } from "contentlayer/generated";
import { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "GET") {
    const secret =
      process.env.EXPORT_ENDPOINT_PASSWORD ?? randomBytes(16).toString('hex');
    if (req.headers.authorization !== secret) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.status(200).json(
      allPages.map(page => ({
        ...page,
        body: page.body.raw,
      })),
    );
  }
};
