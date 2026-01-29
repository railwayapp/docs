import { cn } from "@/lib/cn";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { type VariantProps, cva } from "class-variance-authority";

const badgeVariants = cva(
  "h-6 gap-x-1.5 rounded-lg border px-2 py-0.5 text-sm/5 sm:text-xs/5 font-medium has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app aria-invalid:ring-2 aria-invalid:ring-danger-solid/40 aria-invalid:border-danger overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default:
          "bg-primary-solid border-transparent text-white [&[href]]:hover:bg-primary-solid-hover",
        secondary:
          "bg-muted-element border-transparent text-muted-high-contrast [&[href]]:hover:bg-muted-element-hover",
        danger:
          "bg-danger-element border-transparent text-danger-base [&[href]]:hover:bg-danger-element-hover focus-visible:ring-danger-solid",
        success:
          "bg-success-element border-transparent text-success-base [&[href]]:hover:bg-success-element-hover focus-visible:ring-success-solid",
        warning:
          "bg-warning-element border-transparent text-warning-base [&[href]]:hover:bg-warning-element-hover focus-visible:ring-warning-solid",
        outline:
          "border-muted text-muted-high-contrast [&[href]]:hover:bg-muted-element [&[href]]:hover:text-muted-base",
        ghost:
          "border-transparent text-muted-base hover:bg-muted-element hover:text-muted-high-contrast",
        link: "border-transparent text-primary-base underline-offset-4 hover:underline hover:text-primary-high-contrast",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
