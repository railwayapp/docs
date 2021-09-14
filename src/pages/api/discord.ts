import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const body = JSON.parse(req.body);
    const discordBody = {
      content: `:speaking_head:
      Topic: ${body.topic}
      Was it helpful?: ${body.direction ? "Yes" : "No"}
      Feedback: ${body.feedback.length === 0 ? "N/A" : body.feedback}`,
    };
    const resp = await fetch(`${process.env.DISCORD_WEBHOOK}`, {
      body: JSON.stringify(discordBody),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
  }
  res.status(200).json({ status: "Success" });
};
