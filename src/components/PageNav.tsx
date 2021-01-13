import tw from "twin.macro";
import React from "react";

export interface Props {}

export const PageNav: React.FC<Props> = () => {
  return (
    <div tw="flex-col bg-yellow-300 pt-10 px-8 pb-6 hidden lg:flex">
      <aside tw="sticky top-28">SIDE NAV</aside>
    </div>
  );
};
