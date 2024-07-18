import React, { FormEvent, useMemo } from "react";
import tw from "twin.macro";
import { useForum } from "@/hooks/useForum";
import { MessageSquare } from "react-feather";
import { COMMUNITY_WEB_BASE_URL,COMMUNITY_TOPIC } from "@/config";


export const Forum: React.FC<{ slug: string | string[] }> = ({ slug }) => {
  const [section, topic] = useMemo(() => {
    return slug.length === 2 ? [slug[0], slug[1]] : ['docs', slug[0]];
  }, [slug]);

  const { forumThread, isLoading } = useForum(section, topic);

  const openCommunityThreadInNewTab = (communityThreadSlug: string, event: React.MouseEvent | FormEvent) => {
    event.preventDefault();
    if (typeof window !== "undefined") {
        window.open(`${COMMUNITY_WEB_BASE_URL}/${COMMUNITY_TOPIC}/${communityThreadSlug}`, '_blank', 'noopener,noreferrer');
      };
  };

  if (isLoading || !forumThread.communitySlug) {
    return <></>;
  };

  return (
    <>
    {forumThread.communitySlug && (
      <div css={tw`flex flex-col sm:flex-row items-center justify-between border rounded-md p-4 space-x-0 sm:space-x-4 mt-12`}>
        <div css={tw`flex flex-row items-center space-x-14`}>
          {forumThread.replyCount ? (
            <>
              <div css={tw`relative flex items-center justify-center mb-2 sm:mb-0`}>
                {forumThread.replyCount > 0 && (
                  <div css={tw`absolute -top-3 -right-4`}>
                    <div css={tw`w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center`}>
                      <span css={tw`text-xs text-white`}>{forumThread.replyCount}</span>
                    </div>
                  </div>
                )}
                <MessageSquare css={tw`text-pink-200`} size={25} />
              </div>
              <p>People are discussing this topic in Forums.</p>
            </>
          ) : (
            <>
              <div css={tw`flex items-center justify-center`}>
                <MessageSquare css={tw`text-pink-200`} size={30} />
              </div>
              <p>Not finding the answer you need?</p>
            </>
          )}
        </div>
        <div css={tw`flex items-center justify-center`}>
          <button
            onClick={e => openCommunityThreadInNewTab(forumThread.communitySlug!, e)}
            css={tw`border border-pink-200 rounded-md px-4 py-2 hover:bg-pink-100`}
          >
            {forumThread.replyCount ? "Join the Discussion" : "Start a Discussion"}
          </button>
        </div>
      </div>
    )}
    </>
  );
};
