import React, { FormEvent, useState } from "react";
import { ThumbsDown, ThumbsUp } from "react-feather";
import "twin.macro";
import { Banner } from "./Banner";

export const Feedback: React.FC<{ topic: string }> = ({ topic }) => {
  const [helpful, setHelpful] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendFeedback = async (event: React.MouseEvent | FormEvent) => {
    event.preventDefault();
    setError(false);
    setIsSubmitting(true);
    const feedback =
      event.target instanceof HTMLFormElement
        ? event.target?.feedback?.value ?? ""
        : "";

    try {
      const res = await fetch("/api/feedback", {
        body: JSON.stringify({
          topic,
          feedback,
          helpful,
        }),
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {success && (
        <Banner tw="mt-32" variant="info">
          Thank you for your feedback!
        </Banner>
      )}
      {error && (
        <Banner tw="mt-32" variant="danger">
          Something went wrong. Please try again.
        </Banner>
      )}

      {!success && (
        <>
          {helpful && (
            <div tw="flex flex-row [align-items:center] mt-32">
              <div tw="font-semibold text-lg mr-4">Was this page helpful?</div>
              <button
                onClick={e => sendFeedback(e)}
                disabled={isSubmitting}
                tw="mr-2 flex [align-items:center] border border-blue-200 rounded-md px-4 py-2 hover:bg-blue-100 disabled:opacity-50"
              >
                <ThumbsUp tw="mr-2 text-blue-700" />
                <div tw="font-semibold text-blue-900">Yes</div>
              </button>
              <button
                onClick={e => setHelpful(false)}
                disabled={isSubmitting}
                tw="flex [align-items:center] border border-red-200 rounded-md px-4 py-2 hover:[background-color:#FBEAEA] disabled:opacity-50"
              >
                <ThumbsDown tw="mr-2 text-red-500" />
                <div tw="font-semibold text-red-700">No</div>
              </button>
            </div>
          )}

          {!helpful && (
            <form tw="mt-16" onSubmit={sendFeedback}>
              <textarea
                tw="border rounded-md w-full p-2 my-6"
                id="feedback"
                name="feedback"
                rows={3}
                required
                placeholder="What was missing or inaccurate?"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                tw="border border-gray-200 p-2 rounded-md font-semibold text-gray-400 bg-gray-100 mr-8 hover:text-gray-700 disabled:opacity-50"
              >
                Submit Feedback
              </button>
              <button onClick={e => setHelpful(true)} disabled={isSubmitting}>
                Cancel
              </button>
            </form>
          )}
        </>
      )}
    </>
  );
};
