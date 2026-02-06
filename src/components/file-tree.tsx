import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useId,
  useState,
} from "react";
import { Icon } from "./icon";

type FileTreeContextType = {
  expandedIds: Set<string>;
  toggle: (id: string) => void;
};

const FileTreeContext = createContext<FileTreeContextType | null>(null);

const useFileTree = () => {
  const ctx = useContext(FileTreeContext);
  if (!ctx) throw new Error("FileTree components must be within FileTree");
  return ctx;
};

type FileTreeProps = HTMLAttributes<HTMLDivElement> & {
  defaultExpanded?: string[];
};

function FileTree({
  children,
  defaultExpanded = [],
  className,
  ...props
}: FileTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpanded),
  );

  const toggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <FileTreeContext.Provider value={{ expandedIds, toggle }}>
      <div
        className={cn(
          "rounded-lg border border-border bg-background-subtle p-2 font-mono text-sm",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </FileTreeContext.Provider>
  );
}

type FolderProps = {
  name: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  level?: number;
};

function Folder({
  name,
  children,
  defaultOpen = false,
  level = 0,
}: FolderProps) {
  const id = useId();
  const { expandedIds, toggle } = useFileTree();
  const [localOpen, setLocalOpen] = useState(defaultOpen);

  // Use context if available, otherwise use local state
  const isOpen = expandedIds.has(id) || localOpen;

  const handleClick = () => {
    toggle(id);
    setLocalOpen(prev => !prev);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1.5 rounded px-2 py-1 text-left transition-colors",
          "hover:bg-background-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
        style={{ paddingLeft: level * 16 + 8 }}
      >
        <Icon
          name="ChevronRight"
          className={cn(
            "size-3 text-foreground-muted transition-transform duration-150",
            isOpen && "rotate-90",
          )}
        />
        <Icon name="Folder" className="size-4 text-foreground-muted" />
        <span className="text-foreground">{name}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div>
              {Array.isArray(children)
                ? children.map((child, i) =>
                    cloneWithLevel(child, level + 1, i),
                  )
                : cloneWithLevel(children, level + 1, 0)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type FileProps = {
  name: string;
  level?: number;
  highlight?: boolean;
};

function File({ name, level = 0, highlight = false }: FileProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded px-2 py-1",
        highlight && "bg-primary/10 text-primary",
      )}
      style={{ paddingLeft: level * 16 + 8 + 12 }} // +12 to align with folder content
    >
      <Icon
        name="File"
        className={cn(
          "size-4",
          highlight ? "text-primary" : "text-foreground-muted",
        )}
      />
      <span
        className={highlight ? "text-primary font-medium" : "text-foreground"}
      >
        {name}
      </span>
    </div>
  );
}

// Helper to clone children with level prop
function cloneWithLevel(
  child: ReactNode,
  level: number,
  key: number,
): ReactNode {
  if (!child || typeof child !== "object" || !("type" in child)) {
    return child;
  }

  const element = child as React.ReactElement<{ level?: number }>;
  if (element.type === Folder || element.type === File) {
    return { ...element, key: String(key), props: { ...element.props, level } };
  }
  return child;
}

// Attach sub-components
FileTree.Folder = Folder;
FileTree.File = File;

export { FileTree };
