import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import {
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
} from "react";
import { Icon } from "./icon";
import type { IconName } from "@/assets/icons/types";

type TreeContextType = {
  expandedIds: Set<string>;
  selectedIds: string[];
  toggleExpanded: (nodeId: string) => void;
  handleSelection: (nodeId: string, ctrlKey: boolean) => void;
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  indent?: number;
  animateExpand?: boolean;
};

const TreeContext = createContext<TreeContextType | undefined>(undefined);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("Tree components must be used within a Tree");
  }
  return context;
};

type TreeNodeContextType = {
  nodeId: string;
  level: number;
  isLast: boolean;
  parentPath: boolean[];
};

const TreeNodeContext = createContext<TreeNodeContextType | undefined>(
  undefined,
);

const useTreeNode = () => {
  const context = useContext(TreeNodeContext);
  if (!context) {
    throw new Error("TreeNode components must be used within a TreeNode");
  }
  return context;
};

type TreeProps = HTMLAttributes<HTMLDivElement> & {
  defaultExpandedIds?: string[];
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  indent?: number;
  animateExpand?: boolean;
};

function Tree({
  children,
  defaultExpandedIds = [],
  showLines = true,
  showIcons = true,
  selectable = true,
  multiSelect = false,
  selectedIds,
  onSelectionChange,
  indent = 20,
  animateExpand = true,
  className,
  ...props
}: TreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedIds),
  );
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
    selectedIds ?? [],
  );

  const isControlled =
    selectedIds !== undefined && onSelectionChange !== undefined;
  const currentSelectedIds = isControlled ? selectedIds : internalSelectedIds;

  const toggleExpanded = useCallback((nodeId: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleSelection = useCallback(
    (nodeId: string, ctrlKey = false) => {
      if (!selectable) {
        return;
      }

      let newSelection: string[];

      if (multiSelect && ctrlKey) {
        newSelection = currentSelectedIds.includes(nodeId)
          ? currentSelectedIds.filter(id => id !== nodeId)
          : [...currentSelectedIds, nodeId];
      } else {
        newSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
      }

      if (isControlled) {
        onSelectionChange?.(newSelection);
      } else {
        setInternalSelectedIds(newSelection);
      }
    },
    [
      selectable,
      multiSelect,
      currentSelectedIds,
      isControlled,
      onSelectionChange,
    ],
  );

  return (
    <TreeContext.Provider
      value={{
        expandedIds,
        selectedIds: currentSelectedIds,
        toggleExpanded,
        handleSelection,
        showLines,
        showIcons,
        selectable,
        multiSelect,
        indent,
        animateExpand,
      }}
    >
      <div
        data-slot="tree"
        className={cn("w-full font-mono text-sm", className)}
        {...props}
      >
        {children}
      </div>
    </TreeContext.Provider>
  );
}

type TreeNodeProps = HTMLAttributes<HTMLDivElement> & {
  nodeId?: string;
  level?: number;
  isLast?: boolean;
  parentPath?: boolean[];
};

function TreeNode({
  nodeId: providedNodeId,
  level = 0,
  isLast = false,
  parentPath = [],
  children,
  className,
  ...props
}: TreeNodeProps) {
  const generatedId = useId();
  const nodeId = providedNodeId ?? generatedId;

  const currentPath = level === 0 ? [] : [...parentPath];
  if (level > 0 && parentPath.length < level - 1) {
    while (currentPath.length < level - 1) {
      currentPath.push(false);
    }
  }
  if (level > 0) {
    currentPath[level - 1] = isLast;
  }

  return (
    <TreeNodeContext.Provider
      value={{
        nodeId,
        level,
        isLast,
        parentPath: currentPath,
      }}
    >
      <div
        data-slot="tree-node"
        className={cn("select-none", className)}
        {...props}
      >
        {children}
      </div>
    </TreeNodeContext.Provider>
  );
}

type TreeNodeTriggerProps = HTMLAttributes<HTMLDivElement>;

function TreeNodeTrigger({
  children,
  className,
  onClick,
  ...props
}: TreeNodeTriggerProps) {
  const { selectedIds, toggleExpanded, handleSelection, indent, selectable } =
    useTree();
  const { nodeId, level } = useTreeNode();
  const isSelected = selectedIds.includes(nodeId);

  return (
    <div
      data-slot="tree-node-trigger"
      data-selected={isSelected ? "" : undefined}
      className={cn(
        "group/trigger relative mx-0.5 flex cursor-pointer items-center rounded-md px-2 py-1 transition-colors duration-150",
        "hover:bg-muted-element",
        isSelected && "bg-muted-element-hover",
        selectable &&
          "focus-visible:ring-primary-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        className,
      )}
      style={{ paddingLeft: level * (indent ?? 0) + 8 }}
      tabIndex={selectable ? 0 : undefined}
      onClick={e => {
        toggleExpanded(nodeId);
        handleSelection(nodeId, e.ctrlKey || e.metaKey);
        onClick?.(e);
      }}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleExpanded(nodeId);
          handleSelection(nodeId, e.ctrlKey || e.metaKey);
        }
      }}
      {...props}
    >
      <TreeLines />
      {children}
    </div>
  );
}

function TreeLines() {
  const { showLines, indent } = useTree();
  const { level, isLast, parentPath } = useTreeNode();

  if (!showLines || level === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0">
      {/* Vertical lines for parent levels */}
      {Array.from({ length: level }, (_, index) => {
        const shouldHideLine = parentPath[index] === true;
        if (shouldHideLine && index === level - 1) {
          return null;
        }

        return (
          <div
            key={index}
            className="border-muted absolute inset-y-0 border-l"
            style={{
              left: index * (indent ?? 0) + 12,
              display: shouldHideLine ? "none" : "block",
            }}
          />
        );
      })}

      {/* Horizontal connector */}
      <div
        className="border-muted absolute top-1/2 border-t"
        style={{
          left: (level - 1) * (indent ?? 0) + 12,
          width: (indent ?? 0) - 4,
          transform: "translateY(-0.5px)",
        }}
      />

      {/* L-shape for last items */}
      {isLast && (
        <div
          className="border-muted absolute top-0 border-l"
          style={{
            left: (level - 1) * (indent ?? 0) + 12,
            height: "50%",
          }}
        />
      )}
    </div>
  );
}

type TreeNodeContentProps = ComponentProps<typeof motion.div> & {
  hasChildren?: boolean;
};

function TreeNodeContent({
  children,
  hasChildren = false,
  className,
  ...props
}: TreeNodeContentProps) {
  const { animateExpand, expandedIds } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  return (
    <AnimatePresence initial={false}>
      {hasChildren && isExpanded && (
        <motion.div
          data-slot="tree-node-content"
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
            className={className}
            {...props}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type TreeExpanderProps = HTMLAttributes<HTMLDivElement> & {
  hasChildren?: boolean;
};

function TreeExpander({
  hasChildren = false,
  className,
  onClick,
  ...props
}: TreeExpanderProps) {
  const { expandedIds, toggleExpanded } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  if (!hasChildren) {
    return <div className="mr-1 size-4" />;
  }

  return (
    <div
      data-slot="tree-expander"
      className={cn(
        "mr-1 flex size-4 shrink-0 cursor-pointer items-center justify-center transition-transform duration-150",
        isExpanded && "rotate-90",
        className,
      )}
      onClick={e => {
        e.stopPropagation();
        toggleExpanded(nodeId);
        onClick?.(e);
      }}
      {...props}
    >
      <Icon name="ChevronRight" className="text-muted-base size-3" />
    </div>
  );
}

type TreeIconProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  iconName?: IconName;
  hasChildren?: boolean;
};

function TreeIcon({
  icon,
  iconName,
  hasChildren = false,
  className,
  ...props
}: TreeIconProps) {
  const { showIcons } = useTree();

  if (!showIcons) {
    return null;
  }

  const getDefaultIcon = () => {
    if (hasChildren) {
      return <Icon name="Folder" className="size-4" />;
    }
    return <Icon name="File" className="size-4" />;
  };

  return (
    <div
      data-slot="tree-icon"
      className={cn(
        "text-muted-base mr-2 flex size-4 shrink-0 items-center justify-center",
        className,
      )}
      {...props}
    >
      {icon ||
        (iconName ? (
          <Icon name={iconName} className="size-4" />
        ) : (
          getDefaultIcon()
        ))}
    </div>
  );
}

type TreeLabelProps = HTMLAttributes<HTMLSpanElement>;

function TreeLabel({ className, ...props }: TreeLabelProps) {
  return (
    <span
      data-slot="tree-label"
      className={cn("text-muted-high-contrast flex-1 truncate", className)}
      {...props}
    />
  );
}

export {
  Tree,
  TreeNode,
  TreeNodeTrigger,
  TreeNodeContent,
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeLines,
  useTree,
  useTreeNode,
};
