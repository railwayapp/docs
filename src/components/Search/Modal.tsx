import { useSearchIndex } from "@/hooks/useSearchIndex";
import { DiscordIcon } from "@/components/Icons";
import { Search } from "@/types";
import { Link } from "@/components/Link";
import React, { useCallback, useEffect, useState } from "react";
import { HelpCircle, Mail } from "react-feather";
import tw from "twin.macro";
import SearchResults from "./Results";

const SearchModal: React.FC<{
  closeModal: () => void;
}> = ({ closeModal }) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<Search.MeilisearchResponse | null>(
    null,
  );

  const index = useSearchIndex(
    process.env.NEXT_PUBLIC_MEILISEARCH_HOST ?? "",
    process.env.NEXT_PUBLIC_MEILISEARCH_READ_API_KEY ?? "",
    process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME ?? "",
  );

  const fetchResponse = useCallback(async () => {
    if (query === "") {
      return;
    }
    try {
      const response = await index.search<Search.MeilisearchResponseItem>(
        query,
        {
          limit: 10,
          attributesToHighlight: ["*"],
          highlightPreTag: "<span>",
          highlightPostTag: "</span>",
        },
      );
      setResponse(response.hits);
    } catch (e) {
      console.error(`Search for query "${query}" failed (${e})`);
    }
  }, [query]);

  useEffect(() => {
    if (query === "") {
      return;
    }
    fetchResponse();
  }, [query]);

  return (
    <div
      css={[tw`px-2 mt-12 mb-12`, `sm:px-4`, `md:px-0 md:mt-28 md:mb-28`]}
      onPointerDown={() => {
        closeModal();
      }}
    >
      <div
        onPointerDown={e => e.stopPropagation()}
        css={[tw`bg-background border rounded-lg w-full md:w-1/2 mx-auto`]}
      >
        <input
          placeholder="Search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
          css={[
            tw`px-4 py-4 w-full bg-transparent focus:outline-none`,
            tw`border-b-2 border-gray-200 border-dotted`,
          ]}
        />
        <div className="results">
          {response &&
            (response.length === 0 ? (
              <div css={[tw`flex flex-col items-center justify-center mb-4`]}>
                <HelpCircle size={64} css={tw`mt-8 mb-4 text-pink-300`} />
                <div css={tw`flex flex-col items-center justify-center p-4`}>
                  <p css={tw`font-bold mb-4 text-center`}>
                    We couldn't find what you're searching for.
                  </p>
                  <div>
                    <p css={tw`mb-4`}>Reach out to us if you need help:</p>
                    <div
                      css={tw`flex flex-row gap-4 items-center justify-center`}
                    >
                      <Link
                        href="https://discord.gg/railway"
                        css={[
                          tw`flex flex-row items-center gap-2`,
                          tw`border border-solid rounded-lg`,
                          tw`hover:bg-pink-100`,
                          tw`p-2`,
                        ]}
                      >
                        <DiscordIcon css={tw`w-8 h-8`} />
                        Discord
                      </Link>
                      <Link
                        href="https://discord.gg/railway"
                        css={[
                          tw`flex flex-row items-center gap-2`,
                          tw`border border-solid rounded-lg`,
                          tw`hover:bg-pink-100`,
                          tw`p-2`,
                        ]}
                      >
                        <Mail css={tw`w-8 h-8`} />
                        Email
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <SearchResults response={response} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
