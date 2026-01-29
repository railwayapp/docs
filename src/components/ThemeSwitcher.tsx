import React from "react";
import type { IconName } from "@/assets/icons/types";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";
import { useIsMounted } from "../hooks/useIsMounted";
import { ThemePreference, useTheme } from "../styles/theme";

const themeOptions: {
  value: ThemePreference;
  icon: IconName;
  label: string;
}[] = [
  { value: "system", icon: "Monitor", label: "System theme" },
  { value: "light", icon: "Sun", label: "Light theme" },
  { value: "dark", icon: "Moon", label: "Dark theme" },
];

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-muted bg-muted-app-subtle p-0.5">
      {themeOptions.map(({ value, icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={label}
          title={label}
          className={cn(
            "flex size-6 items-center justify-center rounded-full transition-colors",
            theme === value
              ? "bg-muted-element-active text-muted-high-contrast"
              : "text-muted-base hover:bg-muted-element hover:text-muted-high-contrast",
          )}
        >
          <Icon name={icon} className="size-3.5" />
        </button>
      ))}
    </div>
  );
};
