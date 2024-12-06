import React from "react";
import "twin.macro";
import { ArrowRight } from "react-feather";

interface ButtonProps {
  children: React.ReactNode;
}

export const TallyButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    tw="block font-medium rounded shadow px-3 py-2 focus:outline-none bg-gray-100 border-gray-100 text-gray-800 hover:bg-gray-200"
  >
    <div tw="flex flex-row justify-center items-center font-semibold">
      <ArrowRight tw="mr-1" />
      {children}
    </div>
  </button>
);
