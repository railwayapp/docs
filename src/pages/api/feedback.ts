import { Sentiment } from ".prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../clients/prisma";

export interface FeedbackBody {
  topic: string;
  helpful: boolean;
  feedback?: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const body: FeedbackBody = JSON.parse(req.body);
    const feedbackMessage =
      body.feedback?.trim() === "" ? null : body.feedback?.trim();

    const discordBody = {
      content: `:speaking_head:
      Topic: ${body.topic}
      Was it helpful?: ${body.helpful ? "Yes" : "No"}
      Feedback: ${
        feedbackMessage != null && feedbackMessage.length === 0
          ? "N/A"
          : feedbackMessage
      }`,
    };

    // Save result in prisma
    await prisma.feedback.create({
      data: {
        sentiment: body.helpful ? Sentiment.POSITIVE : Sentiment.NEGATIVE,
        topic: body.topic,
        message: feedbackMessage,
      },
    });

    // Only send Discord message if negative
    if (!body.helpful) {
      await fetch(`${process.env.DISCORD_WEBHOOK}`, {
        body: JSON.stringify(discordBody),
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
    }
  }

  res.status(200).json({ status: "Success" });
};
