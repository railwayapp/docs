import React, { PropsWithChildren } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

export type BannerVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "primary";

const defaultVariant: BannerVariant = "info";

export interface Props {
  variant?: BannerVariant;
  icon?: React.ReactNode;
  hideIcon?: boolean;
  className?: string;
}

const containerStyles: Record<BannerVariant, string> = {
  default: "bg-muted-app-subtle border-muted text-muted-high-contrast",
  primary: "bg-primary-app-subtle border-primary text-primary-high-contrast",
  info: "bg-info-app-subtle border-info text-info-high-contrast",
  success: "bg-success-app-subtle border-success text-success-high-contrast",
  warning: "bg-warning-app-subtle border-warning text-warning-high-contrast",
  danger: "bg-danger-app-subtle border-danger text-danger-high-contrast",
};

const iconStyles: Record<BannerVariant, string> = {
  default: "text-muted-base",
  primary: "text-primary-base",
  info: "text-info-base",
  success: "text-success-base",
  warning: "text-warning-base",
  danger: "text-danger-base",
};

const defaultIcons: Record<BannerVariant, React.ReactNode> = {
  default: null,
  primary: <Icon name="Star" className="size-5" />,
  info: <Icon name="InfoCircle" className="size-5" />,
  success: <Icon name="CheckCircle" className="size-5" />,
  warning: <Icon name="TriangleAlert" className="size-5" />,
  danger: <Icon name="CrossCircle" className="size-5" />,
};

export const Banner: React.FC<PropsWithChildren<Props>> = ({
  children,
  hideIcon = false,
  className,
  variant = defaultVariant,
  icon,
}) => {
  const IconComponent = icon ?? defaultIcons[variant];

  return (
    <div
      data-slot="banner"
      role="alert"
      className={cn(
        "my-6 grid gap-0.5 rounded-lg border px-4 py-3 text-left text-sm",
        IconComponent && !hideIcon && "grid-cols-[auto_1fr] gap-x-3",
        containerStyles[variant],
        className,
      )}
    >
      {!hideIcon && IconComponent && (
        <div className={cn("row-span-2 translate-y-0.5", iconStyles[variant])}>
          {IconComponent}
        </div>
      )}
      <div className="[&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-80">
        {children}
      </div>
    </div>
  );
};

export const PriorityBoardingBanner: React.FC = () => {
  return <Banner variant="primary">This feature is in beta.</Banner>;
};

export const DeprecationBanner: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <Banner variant="warning">{children}</Banner>;
};
