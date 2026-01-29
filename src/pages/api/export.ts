import { allPages } from "content-collections";
import type { NextApiHandler } from "next";
import { randomBytes } from "crypto";

const handler: NextApiHandler = async (req, res) => {
  if (req.method == "GET") {
    const secret =
      process.env.EXPORT_ENDPOINT_PASSWORD ?? randomBytes(16).toString("hex");
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

export default handler;
