import React from "react";
import { Search as SearchIcon } from "react-feather";
import tw from "twin.macro";
import { Icon } from "../Icon";

interface Props {
  clearResponse: () => void;
  query: string;
  setQuery: (q: string) => void;
}

const QueryInput: React.FC<Props> = ({ clearResponse, query, setQuery }) => {
  return (
    <div css={tw`flex flex-col`}>
      <form css={tw`flex flex-row`}>
        <span css={tw`flex items-center px-3`}>
          <SearchIcon css={tw`w-4 text-gray-300`} />
        </span>
        <input
          autoFocus
          css={tw`w-full focus:outline-none bg-transparent`}
          type="text"
          placeholder="Search"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <span css={tw`flex items-center py-2 pr-4`}>
          <button
            css={[
              tw`flex items-center justify-center w-14 h-8 `,
              tw`rounded border border-solid rounded-lg`,
              tw`text-black text-sm dark:text-white`,
              tw`hover:bg-gray-100`,
            ]}
            onClick={e => {
              e.preventDefault();
              clearResponse();
            }}
          >
            <span css={tw`text-gray-500`}>Clear</span>
          </button>
        </span>
      </form>
    </div>
  );
};

export default QueryInput;
