import { scrollToID } from '@/utils/scroll';
import React, { useCallback, useEffect, useState } from 'react';

interface AnchorProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

export const Anchor: React.FC<AnchorProps> = ({ 
  href, 
  children, 
  className = '', 
  target = '_self',
  rel = target === '_blank' ? 'noopener noreferrer' : undefined
}) => {
  return (
    <a 
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={scrollToID(href)}
    >
      {children}
    </a>
  );
};