import React from "react";
import { Search as SearchIcon } from "react-feather";
import tw from "twin.macro";

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
          <SearchIcon />
        </span>
        <input
          autoFocus
          css={tw`w-full focus:outline-none bg-transparent`}
          type="text"
          placeholder="Search"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <span css={tw`flex items-center p-2`}>
          <button
            css={tw`text-black p-3 rounded border border-solid rounded-lg`}
            onClick={e => {
              e.preventDefault();
              clearResponse();
            }}
          >
            Clear
          </button>
        </span>
      </form>
    </div>
  );
};

export default QueryInput;
