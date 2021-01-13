import tw from "twin.macro";
import React from "react";

export interface Props {}

export const PageNav: React.FC<Props> = () => {
  return (
    <Container>
      <Aside>SIDE NAV</Aside>
    </Container>
  );
};

const Container = tw.div`
  flex flex-col
  bg-yellow-300
  pt-10 px-8 pb-6
`;

const Aside = tw.aside`
  sticky top-28
`;
