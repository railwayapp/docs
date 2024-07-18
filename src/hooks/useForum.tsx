import { useState, useEffect } from 'react';
import { fetchFromAPI } from "@/utils/fetchFromAPI";


interface ForumState {
  communitySlug?: string;
  replyCount?: number;
};

export const useForum = (section: string | null, topic: string) => {
  const [forumThread, setForumThread] = useState<ForumState>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeForumState = async () => {
      if (!topic) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const communitySlug = await fetchFromAPI("/api/getCommunityThreadSlug", { section, topic });
        if (communitySlug) {
          setForumThread({ communitySlug: communitySlug });
          const data = await fetchFromAPI("/api/community/getThread", { communitySlug });

          // if the thread has some posts, add them to the state
          if (data.thread && data.thread.replyCount > 0) {
            setForumThread(prevState => ({
              ...prevState,
              replyCount: data.thread.replyCount
            }));
          }  
        } else {
            // if the slug doesn't have a thread in postgres, clear state
            setForumThread({});
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeForumState();
  }, [topic]);

  return { forumThread, isLoading };
}
