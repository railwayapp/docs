import React from "react";
import { Icon } from "./Icon";

interface ButtonProps {
  children: React.ReactNode;
}

export const TallyButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    className="block font-medium rounded-lg shadow-xs px-3 py-2 focus:outline-hidden bg-muted-element border-muted-element text-muted-high-contrast hover:bg-muted-element-hover"
  >
    <div className="flex flex-row justify-center items-center font-semibold">
      <Icon name="ArrowRight" className="mr-1 size-5" />
      {children}
    </div>
  </button>
);
