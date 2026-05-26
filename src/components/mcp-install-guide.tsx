import * as React from "react";
import { Icon } from "./icon";
import { CodeBlock } from "./code-block";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/cn";

type Mode = "local" | "remote";

interface EditorConfig {
  mode: Mode;
  description?: string;
  filename?: string;
  lang: string;
  code: string;
  // Optional supplemental note rendered below the code block.
  note?: React.ReactNode;
  // Optional one-click install button (deeplink).
  button?: { href: string; label: string };
}

interface EditorSection {
  id: string;
  name: string;
  // If the editor only supports one mode, list the supported modes here.
  // Omit to mean "supports both".
  supports?: Mode[];
  // Per-mode configurations. Each supported mode must have an entry.
  configs: Partial<Record<Mode, EditorConfig>>;
}

const CURSOR_DEEPLINK_REMOTE =
  "https://cursor.com/en/install-mcp?name=railway&config=eyJ1cmwiOiJodHRwczovL21jcC5yYWlsd2F5LmNvbSJ9";

const EDITORS: EditorSection[] = [
  {
    id: "cursor",
    name: "Cursor",
    configs: {
      local: {
        mode: "local",
        description:
          "Run `railway mcp install --agent cursor`, or add the following to `.cursor/mcp.json`:",
        filename: ".cursor/mcp.json",
        lang: "json",
        code: `{
  "mcpServers": {
    "railway": {
      "command": "railway",
      "args": ["mcp"]
    }
  }
}`,
      },
      remote: {
        mode: "remote",
        description:
          "Use the one-click installer, or add the following to `.cursor/mcp.json`:",
        filename: ".cursor/mcp.json",
        lang: "json",
        code: `{
  "mcpServers": {
    "railway": {
      "url": "https://mcp.railway.com"
    }
  }
}`,
        button: {
          href: CURSOR_DEEPLINK_REMOTE,
          label: "Add to Cursor",
        },
      },
    },
  },
  {
    id: "vs-code",
    name: "VS Code",
    configs: {
      local: {
        mode: "local",
        description: "Add the following to `.vscode/mcp.json`:",
        filename: ".vscode/mcp.json",
        lang: "json",
        code: `{
  "servers": {
    "railway": {
      "type": "stdio",
      "command": "railway",
      "args": ["mcp"]
    }
  }
}`,
      },
      remote: {
        mode: "remote",
        description: "Add the following to `.vscode/mcp.json`:",
        filename: ".vscode/mcp.json",
        lang: "json",
        code: `{
  "servers": {
    "railway": {
      "type": "http",
      "url": "https://mcp.railway.com"
    }
  }
}`,
      },
    },
  },
  {
    id: "claude-code",
    name: "Claude Code",
    configs: {
      local: {
        mode: "local",
        description: "Run `railway mcp install --agent claude-code`, or:",
        lang: "bash",
        code: "claude mcp add railway railway mcp",
      },
      remote: {
        mode: "remote",
        description: "Run the following — the first tool call prompts you to authenticate:",
        lang: "bash",
        code: "claude mcp add railway --transport http https://mcp.railway.com",
      },
    },
  },
  {
    id: "codex",
    name: "Codex",
    configs: {
      local: {
        mode: "local",
        description:
          "Run `railway mcp install --agent codex`, or use the [OpenAI Codex CLI](https://developers.openai.com/codex/cli):",
        lang: "bash",
        code: "codex mcp add railway -- railway mcp",
      },
      remote: {
        mode: "remote",
        description: "Add the following to your Codex config:",
        lang: "toml",
        code: `[mcp_servers.railway]
url = "https://mcp.railway.com"`,
      },
    },
  },
  {
    id: "copilot",
    name: "GitHub Copilot CLI",
    configs: {
      local: {
        mode: "local",
        description:
          "Run `railway mcp install --agent copilot`, or add the following to `~/.copilot/mcp-config.json`:",
        filename: "~/.copilot/mcp-config.json",
        lang: "json",
        code: `{
  "mcpServers": {
    "railway": {
      "type": "local",
      "command": "railway",
      "args": ["mcp"],
      "tools": ["*"]
    }
  }
}`,
      },
      remote: {
        mode: "remote",
        description:
          "Run `railway mcp install --agent copilot --remote`, or add the following to `~/.copilot/mcp-config.json`:",
        filename: "~/.copilot/mcp-config.json",
        lang: "json",
        code: `{
  "mcpServers": {
    "railway": {
      "type": "http",
      "url": "https://mcp.railway.com",
      "tools": ["*"]
    }
  }
}`,
      },
    },
  },
  {
    id: "factory-droid",
    name: "Factory Droid",
    configs: {
      local: {
        mode: "local",
        description:
          "Run `railway mcp install --agent factory-droid`, or install in [Factory](https://docs.factory.ai/cli/configuration/mcp):",
        lang: "bash",
        code: 'droid mcp add railway "railway mcp"',
      },
      remote: {
        mode: "remote",
        description: "Install in Factory with the remote URL:",
        lang: "bash",
        code: "droid mcp add railway https://mcp.railway.com",
      },
    },
  },
  {
    id: "opencode",
    name: "OpenCode",
    configs: {
      local: {
        mode: "local",
        description:
          "Run `railway mcp install --agent opencode`, or add the following to `opencode.json`:",
        filename: "opencode.json",
        lang: "json",
        code: `{
  "mcp": {
    "railway": {
      "type": "local",
      "command": ["railway", "mcp"]
    }
  }
}`,
      },
      remote: {
        mode: "remote",
        description: "Add the following to `opencode.json`:",
        filename: "opencode.json",
        lang: "json",
        code: `{
  "mcp": {
    "railway": {
      "type": "remote",
      "url": "https://mcp.railway.com"
    }
  }
}`,
      },
    },
  },
  {
    id: "windsurf",
    name: "Windsurf",
    supports: ["remote"],
    configs: {
      remote: {
        mode: "remote",
        description:
          "Add the following to `~/.codeium/windsurf/mcp_config.json` and reload Windsurf:",
        filename: "~/.codeium/windsurf/mcp_config.json",
        lang: "json",
        code: `{
  "mcpServers": {
    "railway": {
      "serverUrl": "https://mcp.railway.com"
    }
  }
}`,
      },
    },
  },
  {
    id: "cline",
    name: "Cline",
    supports: ["remote"],
    configs: {
      remote: {
        mode: "remote",
        description:
          "Open the Cline extension in VS Code, choose **MCP Servers → Configure MCP Servers**, and add:",
        lang: "json",
        code: `{
  "mcpServers": {
    "railway": {
      "type": "streamableHttp",
      "url": "https://mcp.railway.com"
    }
  }
}`,
      },
    },
  },
  {
    id: "devin",
    name: "Devin",
    supports: ["remote"],
    configs: {
      remote: {
        mode: "remote",
        description:
          "Devin configures remote MCP servers through its web UI. In your Devin workspace, go to **Settings → Integrations → MCP** and add a new server with the URL:",
        lang: "text",
        code: "https://mcp.railway.com",
      },
    },
  },
];

export function McpInstallGuide() {
  const [mode, setMode] = React.useState<Mode>("local");

  return (
    <div className="space-y-8">
      <QuickInstall mode={mode} onModeChange={setMode} />
      <div className="space-y-10">
        {EDITORS.map(editor => (
          <EditorBlock
            key={editor.id}
            editor={editor}
            mode={mode}
            onSwitchMode={setMode}
          />
        ))}
      </div>
    </div>
  );
}

function QuickInstall({
  mode,
  onModeChange,
}: {
  mode: Mode;
  onModeChange: (next: Mode) => void;
}) {
  const command =
    mode === "local" ? "railway mcp install" : "railway mcp install --remote";

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
    <div className="relative overflow-hidden rounded-lg border border-muted bg-muted-app-subtle">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-muted bg-muted-element/50 px-3 py-2 sm:px-4">
        <ModeToggle mode={mode} onModeChange={onModeChange} />
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
      <p className="border-t border-muted bg-muted-element/30 px-4 py-2 text-xs text-muted-base">
        {mode === "local"
          ? "Configures detected tools to run the Railway MCP server through the local Railway CLI."
          : "Configures detected tools to use Railway's hosted MCP server at mcp.railway.com via OAuth."}
      </p>
    </div>
  );
}

function ModeToggle({
  mode,
  onModeChange,
}: {
  mode: Mode;
  onModeChange: (next: Mode) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="MCP mode"
      className="inline-flex items-center rounded-md border border-muted bg-muted-element/40 p-0.5"
    >
      <ToggleOption
        active={mode === "local"}
        onClick={() => onModeChange("local")}
        label="Local"
      />
      <ToggleOption
        active={mode === "remote"}
        onClick={() => onModeChange("remote")}
        label="Remote"
      />
    </div>
  );
}

function ToggleOption({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "rounded px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-muted-app text-muted-high-contrast shadow-sm"
          : "text-muted-base hover:text-muted-high-contrast",
      )}
    >
      {label}
    </button>
  );
}

function EditorBlock({
  editor,
  mode,
  onSwitchMode,
}: {
  editor: EditorSection;
  mode: Mode;
  onSwitchMode: (next: Mode) => void;
}) {
  const supports = editor.supports ?? ["local", "remote"];
  const config = editor.configs[mode];

  return (
    <section id={editor.id} className="scroll-mt-24">
      <h3 className="mb-3 text-lg font-semibold text-muted-high-contrast">
        {editor.name}
      </h3>
      {config ? (
        <EditorConfigView config={config} />
      ) : (
        <UnsupportedNotice
          editorName={editor.name}
          supportedMode={supports[0]}
          onSwitchMode={onSwitchMode}
        />
      )}
    </section>
  );
}

function EditorConfigView({ config }: { config: EditorConfig }) {
  return (
    <div className="space-y-3">
      {config.description ? (
        <p
          className="text-sm text-muted-base"
          dangerouslySetInnerHTML={{ __html: renderInlineMarkup(config.description) }}
        />
      ) : null}
      {config.button ? (
        <a
          href={config.button.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-muted bg-muted-element/40 px-3 py-1.5 text-sm font-medium text-muted-high-contrast transition-colors hover:bg-muted-element"
        >
          <Icon name="LinkSquare" className="size-4" />
          {config.button.label}
        </a>
      ) : null}
      <CodeBlock
        code={config.code}
        lang={config.lang}
        filename={config.filename}
      />
      {config.note ? (
        <div className="text-sm text-muted-base">{config.note}</div>
      ) : null}
    </div>
  );
}

function UnsupportedNotice({
  editorName,
  supportedMode,
  onSwitchMode,
}: {
  editorName: string;
  supportedMode: Mode;
  onSwitchMode: (next: Mode) => void;
}) {
  const supportedLabel = supportedMode === "local" ? "Local" : "Remote";
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-dashed border-muted bg-muted-element/20 px-4 py-3 text-sm text-muted-base">
      <span>
        {editorName} only supports <strong>{supportedLabel}</strong> MCP.
      </span>
      <button
        type="button"
        onClick={() => onSwitchMode(supportedMode)}
        className="inline-flex items-center gap-1 rounded-md border border-muted bg-muted-app px-2.5 py-1 text-xs font-medium text-muted-high-contrast transition-colors hover:bg-muted-element"
      >
        Switch to {supportedLabel}
        <Icon name="ArrowRight" className="size-3" />
      </button>
    </div>
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

// Minimal inline markup: backticks for code, [text](url) for links.
// Avoids pulling in a full markdown renderer for short editor descriptions.
function renderInlineMarkup(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, label, href) =>
        `<a href="${href}" target="_blank" rel="noopener noreferrer" class="underline hover:text-muted-high-contrast">${label}</a>`,
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-muted-element/60 px-1 py-0.5 font-mono text-[0.85em] text-muted-high-contrast">$1</code>',
    )
    .replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-semibold text-muted-high-contrast">$1</strong>',
    );
}
