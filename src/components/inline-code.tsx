import React from "react";

export interface Props {
  children?: any;
}

export const InlineCode: React.FC<Props> = ({ children }) => {
  return (
    <code className="rounded-lg font-mono whitespace-nowrap inline-block before:content-[''] after:content-[''] bg-muted-element text-muted-high-contrast px-2 py-0.5">
      {children}
    </code>
  );
};
