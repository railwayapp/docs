import { searchStore } from "@/store";
import React from "react";
import { Search as SearchIcon } from "react-feather";
import tw from "twin.macro";

const OpenModalButton: React.FC = () => {
  return (
    <>
      <button
        onClick={() => searchStore.set(true)}
        css={[
          tw`flex items-center justify-between space-x-4 w-full`,
          tw`rounded border border-gray-300 cursor-pointer`,
          tw`px-2 py-2 md:py-1 text-gray-600 text-left`,
          tw`md:hover:border-pink-300`,
        ]}
      >
        <div tw="flex items-center space-x-2">
          <SearchIcon tw="w-4 h-4" />
          <span tw="text-sm">Search</span>
        </div>
        <div tw="text-gray-600 text-sm hidden md:block">⌘K</div>
      </button>
    </>
  );
};

export default OpenModalButton;
