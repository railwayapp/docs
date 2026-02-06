import { cn } from "@/lib/cn";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import type { ReactNode } from "react";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delayMs?: number;
  className?: string;
  /** If true, removes default styling for custom content like cards */
  unstyled?: boolean;
};

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayMs = 200,
  className,
  unstyled = false,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delay={delayMs}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger className="inline-flex">
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner
            side={side}
            align={align}
            sideOffset={6}
            className="z-50"
          >
            <TooltipPrimitive.Popup
              className={cn(
                "origin-(--transform-origin)",
                "transition-[transform,opacity] duration-150",
                "data-starting-style:scale-95 data-starting-style:opacity-0",
                "data-ending-style:scale-95 data-ending-style:opacity-0",
                !unstyled && [
                  "rounded-md px-2.5 py-1.5",
                  "bg-foreground text-background",
                  "text-xs font-medium",
                  "shadow-md",
                ],
                className,
              )}
            >
              {content}
            </TooltipPrimitive.Popup>
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
