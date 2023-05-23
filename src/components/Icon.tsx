import React from "react";
import tw, { styled } from "twin.macro";

export type IconSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "none";

export interface Props {
  icon: React.ComponentType;
  size?: IconSize;
}

const sizes: Record<IconSize, string | undefined> = {
  xxs: "12px",
  xs: "14px",
  sm: "18px",
  md: "26px",
  lg: "48px",
  xl: "96px",
  none: undefined,
};

export const Icon = React.forwardRef<HTMLDivElement, Props>(
  ({ icon, ...props }, ref) => {
    const Comp = icon;

    return (
      <Container ref={ref} {...props} aria-hidden="true">
        <Comp />
      </Container>
    );
  },
);

const getSize = (s: IconSize): string | undefined =>
  s === "none" ? undefined : sizes[s] ?? s;

const Container = styled.div<Omit<Props, "icon">>`
  ${tw`text-current`}
  width: ${({ size }) => getSize(size ?? "sm")};
  height: ${({ size }) => getSize(size ?? "sm")};
  min-width: ${({ size }) => getSize(size ?? "sm")};
  min-height: ${({ size }) => getSize(size ?? "sm")};

  /* Center icon vertically */
  display: flex;
  align-items: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;
