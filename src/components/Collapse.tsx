import React, {
  PropsWithChildren,
  useEffect,
  useState,
  useCallback,
} from "react";
import tw, { TwStyle } from "twin.macro";
import { slugify } from "@/utils/slugify";
import { Arrow } from "@/components/Arrow";

interface Props {
  title: string;
  slug?: string;
}

const openElements = new Set<string>();

export const Collapse: React.FC<PropsWithChildren<Props>> = ({
  children,
  title,
  slug,
}) => {
  const newSlug = slug ?? slugify(title);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateHash = useCallback((newSlug: string) => {
    window.history.pushState(
      null,
      "",
      newSlug
        ? `#${newSlug}`
        : window.location.pathname + window.location.search,
    );
  }, []);

  const handleOpenState = useCallback(
    (shouldExpand: boolean) => {
      if (shouldExpand) {
        openElements.add(newSlug);
        updateHash(newSlug);
        return;
      }

      openElements.delete(newSlug);
      updateHash(Array.from(openElements).pop() || "");
    },
    [newSlug, updateHash],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setIsExpanded(prevIsOpen => {
        const newIsExpanded = !prevIsOpen;
        handleOpenState(newIsExpanded);
        return newIsExpanded;
      });
    },
    [handleOpenState],
  );

  useEffect(() => {
    const currentHash = window.location.hash.slice(1);

    if (currentHash == newSlug) {
      setIsExpanded(true);
      handleOpenState(true);
    }
  }, [newSlug, handleOpenState]);

  return (
    <details css={tw`my-4 mx-2 cursor-pointer`} id={newSlug} open={isExpanded}>
      <summary css={tw`font-medium flex items-center`} onClick={handleClick}>
        <span css={tw`mr-2`}>
          <Arrow isExpanded={isExpanded} />
        </span>
        {title}
      </summary>
      <div css={tw`cursor-default pl-6`}>{children}</div>
    </details>
  );
};
