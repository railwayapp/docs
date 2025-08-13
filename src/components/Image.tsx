import React from "react";
import { default as NextImage, ImageProps } from "next/legacy/image";

interface ExtImageProps extends ImageProps {
  title?: string;
  href?: string;
}

export const Image: React.FC<ExtImageProps> = ({ title, ...props }) => {
  return (
    <a
      tw="block xl:-mx-8"
      href={props.href ?? (props.src as string)}
      target="_blank"
      rel="noopener"
    >
      <NextImage {...props} title={title} />
    </a>
  );
};
