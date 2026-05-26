import * as React from "react";
import { Checkbox } from "@base-ui/react/checkbox";
import { Icon } from "./icon";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/cn";

type McpChoice = "local" | "remote" | null;

interface AgentInstallCommandProps {
  className?: string;
}

interface CommandInputs {
  agents: boolean;
  mcp: McpChoice;
  autoAccept: boolean;
}

function buildCommand({ agents, mcp, autoAccept }: CommandInputs): string {
  const base = "bash <(curl -fsSL cli.new)";
  const yesFlag = autoAccept ? " -y" : "";

  // Canonical one-liners: --agents runs `railway setup agent`, which configures
  // skills + MCP + login. --remote routes that to the hosted MCP server.
  if (agents && mcp === "local") {
    return `${base} --agents${yesFlag}`;
  }
  if (agents && mcp === "remote") {
    return `${base} --agents --remote${yesFlag}`;
  }

  // Compose CLI install + targeted follow-ups when only one of skills/MCP is wanted.
  const parts = [`${base}${yesFlag}`];
  if (agents) parts.push("railway skills install");
  if (mcp === "local") parts.push("railway mcp install");
  if (mcp === "remote") parts.push("railway mcp install --remote");

  return parts.join(" && ");
}

export function AgentInstallCommand({ className }: AgentInstallCommandProps) {
  const [agents, setAgents] = React.useState(true);
  const [mcp, setMcp] = React.useState<McpChoice>("local");
  const [autoAccept, setAutoAccept] = React.useState(true);

  const command = React.useMemo(
    () => buildCommand({ agents, mcp, autoAccept }),
    [agents, mcp, autoAccept],
  );

  const { copied, copy: copyRaw } = useCopyToClipboard();
  const [shimmerKey, setShimmerKey] = React.useState(0);
  const copy = React.useCallback(
    (text: string) => {
      copyRaw(text);
      setShimmerKey(k => k + 1);
    },
    [copyRaw],
  );

  const handleBodyClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (typeof window === "undefined") return;
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;
      const target = event.target as HTMLElement;
      if (target.closest("a, button")) return;
      copy(command);
    },
    [command, copy],
  );

  return (
    <div
      className={cn(
        "group/install-command relative my-6 overflow-hidden rounded-lg border border-muted bg-muted-app-subtle",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-muted bg-muted-element/50 px-3 py-2 sm:px-4">
        <OptionToggle
          label="Agents"
          checked={agents}
          onCheckedChange={setAgents}
        />
        <OptionToggle
          label="Local MCP"
          checked={mcp === "local"}
          onCheckedChange={next => setMcp(next ? "local" : null)}
        />
        <OptionToggle
          label="Remote MCP"
          checked={mcp === "remote"}
          onCheckedChange={next => setMcp(next ? "remote" : null)}
        />
        <OptionToggle
          label="Auto-accept"
          checked={autoAccept}
          onCheckedChange={setAutoAccept}
        />
        <button
          type="button"
          onClick={() => copy(command)}
          className="ml-auto flex size-7 flex-shrink-0 items-center justify-center rounded-md text-muted-base transition-all hover:bg-muted-element hover:text-muted-high-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid"
          aria-label={copied ? "Copied!" : "Copy command"}
        >
          {copied ? (
            <Icon name="Check" className="size-4 text-success-base" />
          ) : (
            <Icon name="Copy" className="size-4" />
          )}
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label={copied ? "Copied!" : "Click to copy command"}
        onClick={handleBodyClick}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            copy(command);
          }
        }}
        className="relative overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-muted-high-contrast transition-colors hover:bg-muted-element/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-solid"
      >
        <pre className="whitespace-pre">{command}</pre>
        <CopyShimmer shimmerKey={shimmerKey} />
      </div>
    </div>
  );
}

function OptionToggle({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-muted-base transition-colors hover:text-muted-high-contrast">
      <Checkbox.Root
        checked={checked}
        onCheckedChange={next => onCheckedChange(next)}
        className={cn(
          "flex size-4 flex-shrink-0 items-center justify-center rounded border border-muted bg-muted-element transition-colors",
          "hover:border-muted-hover",
          "data-[checked]:border-primary-solid data-[checked]:bg-primary-solid",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app",
        )}
      >
        <Checkbox.Indicator className="flex items-center justify-center text-white">
          <Icon name="Check" className="size-3" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span className={cn(checked && "text-muted-high-contrast")}>{label}</span>
    </label>
  );
}

function CopyShimmer({ shimmerKey }: { shimmerKey: number }) {
  if (shimmerKey === 0) return null;
  return (
    <div
      key={shimmerKey}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-y-0 w-1/3 animate-copy-shimmer bg-gradient-to-r from-transparent via-primary-base/30 to-transparent mix-blend-overlay dark:mix-blend-screen" />
    </div>
  );
}
