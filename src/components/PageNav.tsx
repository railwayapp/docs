import "twin.macro";
import React from "react";

export interface Props {}

export const PageNav: React.FC<Props> = () => {
  return (
    <div tw="flex flex-col bg-yellow-300 pt-10 px-8 pb-6 sticky top-20">
      SIDE NAV
    </div>
  );
};
