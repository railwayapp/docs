import React from "react";
import { Link } from "./Link";
import { Logo } from "./Logo";
import "twin.macro";

export const Nav: React.FC = () => (
  <nav tw="flex items-center justify-between px-3 py-3 text-center bg-pink-300">
    <Link href="/">
      <Logo />
    </Link>
  </nav>
);
