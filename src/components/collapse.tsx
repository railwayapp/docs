import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { slugify } from "@/utils/slugify";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

interface Props {
  title: string;
  slug?: string;
}

const openElements = new Set<string>();

export const Collapse = ({
  children,
  title,
  slug,
}: PropsWithChildren<Props>) => {
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

  const handleToggle = useCallback(
    (open: boolean) => {
      setIsExpanded(open);
      handleOpenState(open);
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
    <CollapsiblePrimitive.Root
      data-slot="collapse"
      id={newSlug}
      open={isExpanded}
      onOpenChange={handleToggle}
      className="my-4"
    >
      <CollapsiblePrimitive.Trigger
        className={cn(
          "group/collapse flex w-full items-center gap-2 text-left font-medium",
          "text-muted-high-contrast hover:text-primary-base",
          "outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app rounded",
        )}
      >
        <Icon
          name="ChevronRight"
          className="size-4 text-muted-base transition-transform duration-150 group-data-open/collapse:rotate-90"
        />
        {title}
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Panel className="h-(--collapsible-panel-height) overflow-hidden text-sm transition-[height] duration-150 ease-out data-ending-style:h-0 data-starting-style:h-0">
        <div className="pt-2 pl-6 text-muted-base">{children}</div>
      </CollapsiblePrimitive.Panel>
    </CollapsiblePrimitive.Root>
  );
};
