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
    const resp = await fetch(
      "https://discord.com/api/webhooks/886039948032090152/TN0AU9rQs3bzWfIR-enPZp9xAW2XeOzYiCQH4Y_W6MX-ABjKaKzsJOTp_psayU_Z8H-f",
      {
        body: JSON.stringify(discordBody),
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }
  res.status(200).json({ status: "Success" });
};
