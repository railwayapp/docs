import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import React, { PropsWithChildren } from "react";
import tw, { styled } from "twin.macro";

export const ScrollArea: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <StyledScrollArea>
      <StyledViewport>{children}</StyledViewport>
      <StyledScrollbarY orientation="vertical">
        <StyledScrollThumb />
      </StyledScrollbarY>
    </StyledScrollArea>
  );
};

const StyledScrollArea = styled(RadixScrollArea.Root)`
  ${tw`relative w-full h-full`}
  z-index: 0;

  & [data-radix-scroll-area-position]::-webkit-scrollbar {
    display: none;
  }
`;

const StyledViewport = styled(RadixScrollArea.Viewport)`
  ${tw`relative max-w-full max-h-full`}
  z-index: 1;
`;

const StyledScrollbarY = styled(RadixScrollArea.Scrollbar)`
  ${tw`absolute select-none transition-opacity w-1 right-0 top-0 bottom-0`}
  z-index: 1;
`;

const StyledScrollThumb = styled(RadixScrollArea.Thumb)`
  ${tw`rounded-full select-none relative left-0 top-0 bg-gray-300`}
`;
