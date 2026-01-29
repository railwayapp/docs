import { cn } from "@/lib/cn";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
  "rounded-lg border border-transparent text-sm [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app aria-invalid:ring-2 aria-invalid:ring-danger-solid/40 aria-invalid:border-danger",
  {
    variants: {
      variant: {
        default:
          "bg-primary-solid text-white hover:bg-primary-solid-hover active:bg-primary-solid-active focus-visible:ring-primary-solid",
        outline:
          "border-muted bg-muted-app hover:bg-muted-element hover:border-muted-hover text-muted-high-contrast aria-expanded:bg-muted-element shadow-xs focus-visible:ring-primary-solid",
        secondary:
          "bg-muted-element text-muted-high-contrast hover:bg-muted-element-hover active:bg-muted-element-active aria-expanded:bg-muted-element-active focus-visible:ring-primary-solid",
        ghost:
          "hover:bg-muted-element text-muted-base hover:text-muted-high-contrast aria-expanded:bg-muted-element focus-visible:ring-primary-solid",
        danger:
          "bg-danger-solid text-white hover:bg-danger-solid-hover active:bg-danger-solid-active focus-visible:ring-danger-solid",
        "danger-subtle":
          "bg-danger-element text-danger-base hover:bg-danger-element-hover active:bg-danger-element-active focus-visible:ring-danger-solid",
        success:
          "bg-success-solid text-white hover:bg-success-solid-hover active:bg-success-solid-active focus-visible:ring-success-solid",
        "success-subtle":
          "bg-success-element text-success-base hover:bg-success-element-hover active:bg-success-element-active focus-visible:ring-success-solid",
        warning:
          "bg-warning-solid text-black hover:bg-warning-solid-hover active:bg-warning-solid-active focus-visible:ring-warning-solid",
        link: "text-primary-base underline-offset-4 hover:underline hover:text-primary-high-contrast focus-visible:ring-primary-solid",
      },
      size: {
        default:
          "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-lg),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-lg),10px)] px-2.5 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-lg),8px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-lg),10px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
