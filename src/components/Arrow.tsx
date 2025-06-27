import React from "react";
import tw from "twin.macro";

interface ArrowProps {
  isExpanded: boolean;
}

export const Arrow: React.FC<ArrowProps> = ({ isExpanded }) => {
  return (
    <svg
      css={[
        tw`h-4 w-4 transition-transform duration-200`,
        { transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }
      ]}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 001.414 0L13.414 10l-4.707-4.707a1 1 0 00-1.414 1.414L10.586 10l-3.293 3.293a1 1 0 000 1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
};
