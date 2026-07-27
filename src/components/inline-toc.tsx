import { TOCItem, type TOCItemType, useActiveAnchor, useTOCItems } from "./toc";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Icon } from "./icon";

// ============================================================================
// InlineTOC - Collapsible inline table of contents with tree-like styling
// ============================================================================

type InlineTOCContextType = {
  showLines: boolean;
  indent: number;
  animateExpand: boolean;
};

const InlineTOCContext = createContext<InlineTOCContextType>({
  showLines: true,
  indent: 16,
  animateExpand: true,
});

const useInlineTOC = () => useContext(InlineTOCContext);

export interface InlineTOCProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Whether to show connecting lines between items
   * @defaultValue true
   */
  showLines?: boolean;
  /**
   * Indentation per depth level in pixels
   * @defaultValue 16
   */
  indent?: number;
  /**
   * Whether to animate expand/collapse
   * @defaultValue true
   */
  animateExpand?: boolean;
  /**
   * Whether the TOC starts expanded
   * @defaultValue true
   */
  defaultExpanded?: boolean;
  /**
   * Title to show in the header
   * @defaultValue "On this page"
   */
  title?: ReactNode;
  /**
   * Text to display when there are no headings
   * @defaultValue "No headings"
   */
  emptyText?: string;
}

export function InlineTOC({
  showLines = true,
  indent = 16,
  animateExpand = true,
  defaultExpanded = true,
  title = "On this page",
  emptyText = "No headings",
  className,
  ...props
}: InlineTOCProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const items = useTOCItems();

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <InlineTOCContext.Provider value={{ showLines, indent, animateExpand }}>
      <div
        data-slot="inline-toc"
        className={cn(
          "w-full select-none rounded-lg border border-muted bg-muted-element/50 font-mono text-sm",
          className,
        )}
        {...props}
      >
        <InlineTOCHeader
          isExpanded={isExpanded}
          onToggle={toggleExpanded}
          title={title}
          itemCount={items.length}
        />
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: animateExpand ? 0.2 : 0,
                ease: "easeOut",
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: -4 }}
                animate={{ y: 0 }}
                exit={{ y: -4 }}
                transition={{
                  duration: animateExpand ? 0.15 : 0,
                  delay: animateExpand ? 0.05 : 0,
                }}
              >
                <InlineTOCContent items={items} emptyText={emptyText} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </InlineTOCContext.Provider>
  );
}

interface InlineTOCHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
  title: ReactNode;
  itemCount: number;
}

function InlineTOCHeader({
  isExpanded,
  onToggle,
  title,
  itemCount,
}: InlineTOCHeaderProps) {
  return (
    <button
      type="button"
      data-slot="inline-toc-header"
      onClick={onToggle}
      className={cn(
        "group/header flex w-full cursor-pointer items-center gap-2 px-3 py-2.5",
        "transition-colors duration-150 hover:bg-muted-element",
        "focus-visible:ring-primary-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
        "rounded-lg",
      )}
    >
      <div
        className={cn(
          "flex size-5 shrink-0 items-center justify-center transition-transform duration-150",
          isExpanded && "rotate-90",
        )}
      >
        <Icon name="ChevronRight" className="text-muted-base size-3.5" />
      </div>
      <span className="text-muted-high-contrast flex-1 text-left text-sm font-medium">
        {title}
      </span>
    </button>
  );
}

interface InlineTOCContentProps {
  items: TOCItemType[];
  emptyText: string;
}

function InlineTOCContent({ items, emptyText }: InlineTOCContentProps) {
  const { showLines, indent } = useInlineTOC();

  if (items.length === 0) {
    return <div className="text-muted-base px-3 pb-3 text-xs">{emptyText}</div>;
  }

  return (
    <div
      data-slot="inline-toc-content"
      className="relative flex flex-col gap-0.5 px-1.5 pb-2"
    >
      {items.map((item, index) => (
        <InlineTOCNode
          key={item.url}
          item={item}
          index={index}
          items={items}
          showLines={showLines}
          indent={indent}
        />
      ))}
    </div>
  );
}

interface InlineTOCNodeProps {
  item: TOCItemType;
  index: number;
  items: TOCItemType[];
  showLines: boolean;
  indent: number;
}

function InlineTOCNode({
  item,
  index,
  items,
  showLines,
  indent,
}: InlineTOCNodeProps) {
  const activeAnchor = useActiveAnchor();
  const isActive = activeAnchor === item.url.slice(1);

  // Calculate visual depth (depth 2 = level 0, depth 3 = level 1, etc.)
  const level = Math.max(0, item.depth - 2);

  // Determine if this is the last item at this depth level
  const isLastAtLevel = (() => {
    for (let i = index + 1; i < items.length; i++) {
      const nextLevel = Math.max(0, items[i].depth - 2);
      if (nextLevel < level) return true;
      if (nextLevel === level) return false;
    }
    return true;
  })();

  // Build parent path for line rendering
  const parentPath = useMemo(() => {
    const path: boolean[] = [];
    let currentDepth = item.depth;

    for (let i = index - 1; i >= 0 && path.length < level; i--) {
      const prevItem = items[i];
      if (prevItem.depth < currentDepth) {
        // Check if this parent is the last at its level
        const parentLevel = Math.max(0, prevItem.depth - 2);
        let isParentLast = true;
        for (let j = i + 1; j < items.length; j++) {
          const checkLevel = Math.max(0, items[j].depth - 2);
          if (checkLevel < parentLevel) break;
          if (checkLevel === parentLevel) {
            isParentLast = false;
            break;
          }
        }
        path.unshift(isParentLast);
        currentDepth = prevItem.depth;
      }
    }

    while (path.length < level) {
      path.unshift(false);
    }

    return path;
  }, [index, items, item.depth, level]);

  return (
    <TOCItem
      href={item.url}
      data-slot="inline-toc-node"
      className={cn(
        "group/node relative flex items-center rounded-md px-2 py-1.5 no-underline!",
        "transition-colors duration-150 hover:bg-muted-element hover:no-underline!",
        isActive && "bg-muted-element-hover",
        "focus-visible:ring-primary-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
      )}
      style={{ paddingLeft: level * indent + 10 }}
    >
      {showLines && level > 0 && (
        <InlineTOCLines
          level={level}
          indent={indent}
          isLast={isLastAtLevel}
          parentPath={parentPath}
        />
      )}
      <span
        className={cn(
          "text-muted-base truncate transition-colors duration-150",
          "group-hover/node:text-muted-high-contrast",
          isActive && "text-primary-base font-medium",
        )}
      >
        {item.title}
      </span>
    </TOCItem>
  );
}

interface InlineTOCLinesProps {
  level: number;
  indent: number;
  isLast: boolean;
  parentPath: boolean[];
}

function InlineTOCLines({
  level,
  indent,
  isLast,
  parentPath,
}: InlineTOCLinesProps) {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0">
      {/* Vertical lines for parent levels */}
      {Array.from({ length: level }, (_, idx) => {
        const shouldHideLine = parentPath[idx] === true;
        if (shouldHideLine && idx === level - 1) {
          return null;
        }

        return (
          <div
            key={idx}
            className="border-muted absolute inset-y-0 border-l"
            style={{
              left: idx * indent + 14,
              display: shouldHideLine ? "none" : "block",
            }}
          />
        );
      })}

      {/* Horizontal connector */}
      <div
        className="border-muted absolute top-1/2 border-t"
        style={{
          left: (level - 1) * indent + 14,
          width: indent - 6,
          transform: "translateY(-0.5px)",
        }}
      />

      {/* L-shape for last items */}
      {isLast && (
        <div
          className="border-muted absolute top-0 border-l"
          style={{
            left: (level - 1) * indent + 14,
            height: "50%",
          }}
        />
      )}
    </div>
  );
}
