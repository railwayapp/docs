import React from "react";
import { Frame } from "./frame";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  title?: string;
  href?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
}

/**
 * Check if an image should be wrapped in Frame for zoom functionality.
 * Excludes badges, buttons, and small icons that don't benefit from zooming.
 */
function shouldWrapInFrame(src?: string): boolean {
  if (!src) return false;

  // Exclude badges and icons that shouldn't have zoom
  const excludePatterns = [
    "railway.com/button.svg", // Deploy on Railway buttons
    "devicons.railway.com", // Small dev icons in tables
  ];

  return !excludePatterns.some(pattern => src.includes(pattern));
}

export const Image: React.FC<ImageProps> = ({
  title,
  href,
  width,
  height,
  quality,
  layout,
  className,
  src,
  ...props
}) => {
  const imgElement = (
    <img
      {...props}
      src={src}
      title={title}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  );

  // If there's an explicit href, wrap in a link (no Frame - already clickable)
  if (href) {
    return (
      <a
        className="block"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {imgElement}
      </a>
    );
  }

  // Wrap in Frame for zoom functionality (unless excluded)
  if (shouldWrapInFrame(src)) {
    return <Frame>{imgElement}</Frame>;
  }

  return imgElement;
};
