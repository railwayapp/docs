import React from "react";
import tw, { TwStyle } from "twin.macro";
import { Icon } from "./Icon";
import {
  Info,
  Star,
  XOctagon,
  CheckCircle,
  AlertTriangle,
} from "react-feather";
import { Link } from "./Link";

export type BannerVariant =
  | "primary"
  | "secondary"
  | "info"
  | "danger"
  | "success"
  | "warning";

const defaultVariant: BannerVariant = "primary";

export interface Props {
  variant?: BannerVariant;
  icon?: React.ComponentType;
  hideIcon?: boolean;
}

const containerStyles: Record<BannerVariant, TwStyle> = {
  primary: tw`text-pink-800 bg-pink-100 border border-pink-200`,
  secondary: tw`text-gray-800 bg-gray-100 border border-gray-200`,
  info: tw`text-blue-800 bg-blue-100 border border-blue-200`,
  danger: tw`text-red-800 bg-red-100 border border-red-200`,
  success: tw`text-green-800 bg-green-100 border border-green-200`,
  warning: tw`text-yellow-800 bg-yellow-100 border border-yellow-200`,
};

const iconStyles: Record<BannerVariant, TwStyle> = {
  primary: tw`text-pink-500`,
  secondary: tw`text-gray-500`,
  info: tw`text-blue-500`,
  danger: tw`text-red-500`,
  success: tw`text-green-500`,
  warning: tw`text-yellow-500`,
};

const defaultIcons: Record<BannerVariant, React.ComponentType | null> = {
  primary: null,
  secondary: null,
  info: Info,
  danger: XOctagon,
  success: CheckCircle,
  warning: AlertTriangle,
};

export const Banner: React.FC<Props> = ({ children, hideIcon, ...props }) => {
  const variant = props.variant ?? defaultVariant;
  const icon = props.icon ?? defaultIcons[variant];

  return (
    <div
      css={[tw`flex p-3 border rounded-md space-x-3`, containerStyles[variant]]}
      className="banner"
      {...props}
    >
      {!hideIcon && icon != null && (
        <Icon tw="mt-1" icon={icon} css={[iconStyles[variant]]} />
      )}

      {hideIcon || icon == null ? <>{children}</> : <span>{children}</span>}
    </div>
  );
};

export const PriorityBoardingBanner: React.FC = () => {
  return (
    <Banner variant="primary" icon={Star}>
      This feature is only available to{" "}
      <Link href="/reference/priority-boarding">Priority Boarding</Link>{" "}
      members.
    </Banner>
  );
};

export const AlphaFeatureBanner: React.FC = () => {
  return (
    <Banner variant="primary" icon={Star}>
      This feature is in alpha and access is granted on a case-by-case basis. To
      request access, visit the{" "}
      <Link href="https://railway.app/account/tokens">tokens</Link> page in the
      Railway dashboard.
    </Banner>
  );
};
