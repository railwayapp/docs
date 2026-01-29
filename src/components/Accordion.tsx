import { cn } from "@/lib/cn";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type AccordionProps = {
  children: ReactNode;
  /** Allow multiple items to be open at once */
  multiple?: boolean;
  /** Default open item values (use the title or provide explicit `value` on AccordionItem) */
  defaultValue?: string[];
  className?: string;
};

function Accordion({
  children,
  multiple = false,
  defaultValue,
  className,
}: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={multiple}
      defaultValue={defaultValue}
      className={cn("flex w-full flex-col", className)}
    >
      {children}
    </AccordionPrimitive.Root>
  );
}

type AccordionItemProps = {
  /** The title shown in the trigger */
  title: ReactNode;
  /** The content shown when expanded */
  children: ReactNode;
  /** Unique value for controlling open state (defaults to title if string) */
  value?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
  className?: string;
};

function AccordionItem({
  title,
  children,
  value,
  disabled,
  className,
}: AccordionItemProps) {
  // Use provided value, or title if it's a string
  const itemValue = value ?? (typeof title === "string" ? title : undefined);

  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      value={itemValue}
      disabled={disabled}
      className={cn("not-last:border-muted not-last:border-b", className)}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            "group/accordion text-muted-high-contrast",
            "relative flex flex-1 items-center justify-between gap-2",
            "rounded-lg border border-transparent py-4 text-left text-sm font-medium",
            "outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {title}
          <Icon
            name="ChevronDown"
            className="text-muted-base size-4 shrink-0 transition-transform duration-200 ease-out group-data-panel-open/accordion:rotate-180"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Panel
        data-slot="accordion-content"
        className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
      >
        <div className="text-muted-base pb-4 [&_a]:underline [&_a]:underline-offset-3 [&_a:hover]:text-muted-high-contrast [&_p:not(:last-child)]:mb-4">
          {children}
        </div>
      </AccordionPrimitive.Panel>
    </AccordionPrimitive.Item>
  );
}

export { Accordion, AccordionItem };
