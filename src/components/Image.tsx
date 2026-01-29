import React from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  title?: string;
  href?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
}

export const Image: React.FC<ImageProps> = ({
  title,
  href,
  width,
  height,
  quality,
  layout,
  className,
  ...props
}) => {
  // If there's an explicit href, wrap in a link (for backwards compatibility)
  if (href) {
    return (
      <a
        className="block"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          {...props}
          title={title}
          width={width}
          height={height}
          className={className}
          loading="lazy"
        />
      </a>
    );
  }

  // Otherwise, just render the image (Frame component handles zoom)
  return (
    <img
      {...props}
      title={title}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  );
};
