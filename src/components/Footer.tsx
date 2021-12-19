import React from "react";
import "twin.macro";

export const Footer: React.FC = () => (
  <footer tw="text-center py-8">
    Copyright © {new Date().getFullYear()} Secta Inc. All rights reserved
  </footer>
);
