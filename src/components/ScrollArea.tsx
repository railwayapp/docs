import { useTouchPrimary } from "@/hooks/useTouchPrimary";
import { cn } from "@/lib/cn";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import * as React from "react";

type Mask = {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
};

export type ScrollAreaContextProps = {
  isTouch: boolean;
  type: "auto" | "always" | "scroll" | "hover";
};

const ScrollAreaContext = React.createContext<ScrollAreaContextProps>({
  isTouch: false,
  type: "hover",
});

interface ScrollAreaProps
  extends Omit<ScrollAreaPrimitive.Root.Props, "children"> {
  children?: React.ReactNode;
  type?: "auto" | "always" | "scroll" | "hover";
  viewportClassName?: string;
  /**
   * `maskHeight` is the height of the mask in pixels.
   * Pass `0` to disable the mask.
   * @default 30
   */
  maskHeight?: number;
  maskClassName?: string;
}

function ScrollArea({
  className,
  children,
  type = "hover",
  maskHeight = 30,
  maskClassName,
  viewportClassName,
  ...props
}: ScrollAreaProps) {
  const [showMask, setShowMask] = React.useState<Mask>({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const isTouch = useTouchPrimary();

  const checkScrollability = React.useCallback(() => {
    const element = viewportRef.current;
    if (!element) return;

    const {
      scrollTop,
      scrollLeft,
      scrollWidth,
      clientWidth,
      scrollHeight,
      clientHeight,
    } = element;
    setShowMask(prev => ({
      ...prev,
      top: scrollTop > 0,
      bottom: scrollTop + clientHeight < scrollHeight - 1,
      left: scrollLeft > 0,
      right: scrollLeft + clientWidth < scrollWidth - 1,
    }));
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const element = viewportRef.current;
    if (!element) return;

    const controller = new AbortController();
    const { signal } = controller;

    const resizeObserver = new ResizeObserver(checkScrollability);
    resizeObserver.observe(element);

    element.addEventListener("scroll", checkScrollability, { signal });
    window.addEventListener("resize", checkScrollability, { signal });

    checkScrollability();

    return () => {
      controller.abort();
      resizeObserver.disconnect();
    };
  }, [checkScrollability, isTouch]);

  return (
    <ScrollAreaContext.Provider value={{ isTouch, type }}>
      {isTouch ? (
        <div
          {...props}
          role="group"
          data-slot="scroll-area"
          aria-roledescription="scroll area"
          className={cn("relative overflow-hidden", className)}
        >
          <div
            ref={viewportRef}
            className={cn("size-full overflow-auto", viewportClassName)}
            tabIndex={0}
          >
            {children}
          </div>
          {maskHeight > 0 && (
            <ScrollMask
              showMask={showMask}
              className={maskClassName}
              maskHeight={maskHeight}
            />
          )}
        </div>
      ) : (
        <ScrollAreaPrimitive.Root
          data-slot="scroll-area"
          className={cn("relative overflow-hidden", className)}
          {...props}
        >
          <ScrollAreaPrimitive.Viewport
            ref={viewportRef}
            data-slot="scroll-area-viewport"
            className={cn(
              "focus-visible:ring-primary-solid focus-visible:ring-offset-muted-app size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              viewportClassName,
            )}
          >
            <ScrollAreaPrimitive.Content>
              {children}
            </ScrollAreaPrimitive.Content>
          </ScrollAreaPrimitive.Viewport>
          <ScrollBar />
          <ScrollBar orientation="horizontal" />
          <ScrollAreaPrimitive.Corner />
          {maskHeight > 0 && (
            <ScrollMask
              showMask={showMask}
              className={maskClassName}
              maskHeight={maskHeight}
            />
          )}
        </ScrollAreaPrimitive.Root>
      )}
    </ScrollAreaContext.Provider>
  );
}

interface ScrollBarProps extends ScrollAreaPrimitive.Scrollbar.Props {
  orientation?: "vertical" | "horizontal";
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollBarProps) {
  const { isTouch, type } = React.useContext(ScrollAreaContext);

  if (isTouch) return null;

  return (
    <ScrollAreaPrimitive.Scrollbar
      orientation={orientation}
      data-slot="scroll-area-scrollbar"
      className={cn(
        "hover:bg-muted-element flex touch-none p-px transition-[colors,opacity] duration-150 ease-out select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        type === "hover" && "opacity-0 data-[hovering]:opacity-100",
        type === "scroll" && "opacity-0 data-[scrolling]:opacity-100",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={cn(
          "bg-muted-element relative flex-1 rounded-full transition-[background-color,transform]",
          orientation === "vertical" && "my-1 active:scale-y-95",
          orientation === "horizontal" && "mx-1 active:scale-x-95",
          "hover:bg-muted-element-hover",
        )}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

function ScrollMask({
  showMask,
  maskHeight,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  showMask: Mask;
  maskHeight: number;
}) {
  return (
    <>
      <div
        {...props}
        aria-hidden="true"
        style={
          {
            "--top-fade-height": showMask.top ? `${maskHeight}px` : "0px",
            "--bottom-fade-height": showMask.bottom ? `${maskHeight}px` : "0px",
          } as React.CSSProperties
        }
        className={cn(
          "pointer-events-none absolute inset-0 z-10",
          "before:absolute before:inset-x-0 before:top-0 before:transition-[height,opacity] before:duration-300 before:content-['']",
          "after:absolute after:inset-x-0 after:bottom-0 after:transition-[height,opacity] after:duration-300 after:content-['']",
          "before:h-[var(--top-fade-height)] after:h-[var(--bottom-fade-height)]",
          showMask.top ? "before:opacity-100" : "before:opacity-0",
          showMask.bottom ? "after:opacity-100" : "after:opacity-0",
          "before:from-muted-app before:bg-gradient-to-b before:to-transparent",
          "after:from-muted-app after:bg-gradient-to-t after:to-transparent",
          className,
        )}
      />
      <div
        {...props}
        aria-hidden="true"
        style={
          {
            "--left-fade-width": showMask.left ? `${maskHeight}px` : "0px",
            "--right-fade-width": showMask.right ? `${maskHeight}px` : "0px",
          } as React.CSSProperties
        }
        className={cn(
          "pointer-events-none absolute inset-0 z-10",
          "before:absolute before:inset-y-0 before:left-0 before:transition-[width,opacity] before:duration-300 before:content-['']",
          "after:absolute after:inset-y-0 after:right-0 after:transition-[width,opacity] after:duration-300 after:content-['']",
          "before:w-[var(--left-fade-width)] after:w-[var(--right-fade-width)]",
          showMask.left ? "before:opacity-100" : "before:opacity-0",
          showMask.right ? "after:opacity-100" : "after:opacity-0",
          "before:from-muted-app before:bg-gradient-to-r before:to-transparent",
          "after:from-muted-app after:bg-gradient-to-l after:to-transparent",
          className,
        )}
      />
    </>
  );
}

export { ScrollArea, ScrollBar };
