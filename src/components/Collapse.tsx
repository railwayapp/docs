import React, { PropsWithChildren } from "react";
import tw, { TwStyle } from "twin.macro";

interface Props {
  title: string;
}

export const Collapse: React.FC<PropsWithChildren<Props>> = ({
  children,
  title,
}) => {
  return (
    <details css={tw`my-4 mx-2 cursor-pointer`}>
      <summary css={tw`font-medium`}>{title}</summary>
      {children}
    </details>
  );
};
