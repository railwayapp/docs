import React from "react";
import { Link } from "./Link";
import { Logo } from "./Logo";
import tw from "twin.macro";

export const Nav: React.FC = () => (
  <Header>
    <input placeholder="search" />
  </Header>
);

const Header = tw.header`
  flex items-center justify-between
  px-3 py-3 text-center bg-pink-300
  sticky top-0
`;
