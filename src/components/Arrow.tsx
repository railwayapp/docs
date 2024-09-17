import React from 'react';
import tw from "twin.macro";

interface ArrowProps {
  isExpanded: boolean;
}

export const Arrow: React.FC<ArrowProps> = ({ isExpanded }) => {
  if (isExpanded) {
    return (
      <svg css={[tw`h-4 w-4`]} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg css={[tw`h-4 w-4`]} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 001.414 0L13.414 10l-4.707-4.707a1 1 0 00-1.414 1.414L10.586 10l-3.293 3.293a1 1 0 000 1.414z" clipRule="evenodd" />
    </svg>
  );
};