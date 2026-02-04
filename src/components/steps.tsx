import { cn } from "@/lib/cn";
import * as React from "react";

function Steps({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="steps"
      className={cn("[counter-reset:step] space-y-6 my-6", className)}
      {...props}
    />
  );
}

interface StepProps extends React.ComponentProps<"li"> {
  title?: string;
}

function Step({ className, children, title, ...props }: StepProps) {
  return (
    <li
      data-slot="step"
      className={cn(
        "relative pl-12 pb-6 [counter-increment:step] last:pb-0",
        // Connecting line
        "before:absolute before:left-4 before:top-10 before:h-[calc(100%-2.5rem)] before:w-px before:bg-muted last:before:hidden",
        className,
      )}
      {...props}
    >
      {/* Step number indicator */}
      <span
        data-slot="step-indicator"
        className="bg-primary-element text-primary-high-contrast absolute left-0 top-0 flex size-8 items-center justify-center rounded-full text-sm font-semibold before:content-[counter(step)]"
        aria-hidden="true"
      />
      {/* Step content */}
      <div data-slot="step-content" className="[&>h3]:mt-0 [&>h3]:mb-2 [&>h3]:text-base [&>h3]:font-semibold [&>p]:my-2 [&>p:first-of-type]:mt-0">
        {title && (
          <h3 className="text-muted-high-contrast font-semibold text-base mt-0 mb-2">
            {title}
          </h3>
        )}
        {children}
      </div>
    </li>
  );
}

export { Steps, Step };
