import React from "react";
import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import tw, { styled } from "twin.macro";

export const ScrollArea: React.FC = ({ children }) => {
  return (
    <StyledScrollArea>
      <StyledViewport>{children}</StyledViewport>
      <StyledScrollbarY>
        <StyledScrollTrack>
          <StyledScrollThumb />
        </StyledScrollTrack>
      </StyledScrollbarY>
    </StyledScrollArea>
  );
};

const { SCROLL_AREA_CSS_PROPS } = RadixScrollArea;

const StyledScrollArea = styled(RadixScrollArea.Root)`
  ${tw`relative max-w-full max-h-full`}
  z-index: 0;

  & [data-radix-scroll-area-position]::-webkit-scrollbar {
    display: none;
  }
`;

const StyledViewport = styled(RadixScrollArea.Viewport)`
  ${tw`relative`}
  z-index: 1;
`;

const StyledScrollbarY = styled(RadixScrollArea.ScrollbarY)`
  ${tw`absolute select-none transition-opacity w-1 right-0 top-0 bottom-0`}
  z-index: 1;
`;

const StyledScrollTrack = styled(RadixScrollArea.Track)`
  ${tw`relative w-full h-full`}
  z-index: -1;
`;

const StyledScrollThumb = styled(RadixScrollArea.Thumb)`
  ${tw`rounded-full select-none absolute left-0 top-0 bg-gray-300`}
  will-change: var(${SCROLL_AREA_CSS_PROPS.scrollbarThumbWillChange});
  width: var(${SCROLL_AREA_CSS_PROPS.scrollbarThumbWidth});
  height: var(${SCROLL_AREA_CSS_PROPS.scrollbarThumbHeight});
`;
