import * as React from "react";
import Link from "next/link";
import { Icon } from "./icon";
import { CodeBlock } from "./code-block";
import { Card, CardGrid } from "./card";
import { cn } from "@/lib/cn";
import {
  cloudAgentClients,
  cloudAgentCommand,
  cloudAgentTools,
  isOpenCode,
  supportsLocalApp,
  type CloudAgentMode,
  type CloudAgentTool,
} from "@/data/cloud-agents";

type Workflow = "railway" | "local";

const workflows = [
  {
    id: "railway",
    name: "Run agents in Railway",
    description: "Launch and manage sessions through the Railway CLI.",
  },
  {
    id: "local",
    name: "Connect your local app",
    description:
      "Use an app on your computer with a remote Railway environment.",
  },
] as const;

export function CloudAgentTools() {
  return (
    <div
      role="list"
      aria-label="Coding agents available in the Railway CLI"
      className="my-5 flex flex-wrap gap-2"
    >
      {cloudAgentTools.map(tool => (
        <span
          key={tool.id}
          role="listitem"
          className="rounded-full border border-muted bg-muted-app-subtle px-3 py-1.5 text-sm font-medium text-muted-high-contrast"
        >
          {tool.name}
        </span>
      ))}
    </div>
  );
}

export function CloudAgentClients() {
  return (
    <CardGrid columns={3}>
      {cloudAgentClients
        .filter(client => client.id !== "opencode2")
        .map(client => (
          <Card
            key={client.id}
            title={client.name}
            description={client.description}
            href={client.href}
            icon={client.icon}
          />
        ))}
    </CardGrid>
  );
}

export function CloudAgentLauncher() {
  const [workflow, setWorkflow] = React.useState<Workflow>("railway");
  const [selected, setSelected] = React.useState<CloudAgentTool>("claude");
  const [localInterface, setLocalInterface] = React.useState<
    "desktop" | "local"
  >("desktop");
  const client = cloudAgentClients.find(item => item.id === selected);
  const openCode = isOpenCode(selected);
  const choices = workflow === "railway" ? cloudAgentTools : cloudAgentClients;
  const mode: CloudAgentMode =
    workflow === "railway" ? "remote" : openCode ? localInterface : "desktop";
  const command = cloudAgentCommand(selected, mode);
  const next =
    mode === "desktop"
      ? selected === "claude"
        ? "Restart Claude Desktop. In Code, choose Railway · <agent-name> from the environment dropdown and open /app."
        : selected === "codex"
          ? "Restart Codex. Open Settings → Connections → SSH, select railway-agent-<agent-name>, and add /app as a remote project."
          : `Open ${selected === "opencode2" ? "OpenCode Beta" : "OpenCode Desktop"}. From Home → Projects, open Railway: <agent-name> → /app and start a new session.`
      : mode === "local"
        ? "Railway starts the cloud server and prints its connection settings. Press Enter to connect with your local client; Railway offers to install it if missing."
        : "Your terminal opens a session in Railway CA. The coding agent runs on the cloud agent. Press Option+F to show the agent tree, or use railway ca to return to running sessions.";

  return (
    <div className="my-7 overflow-hidden rounded-xl border border-muted bg-muted-app-subtle">
      <div className="space-y-6 p-5">
        <fieldset>
          <legend className="mb-3 text-base font-semibold text-muted-high-contrast">
            1. Choose how you want to work
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {workflows.map(item => (
              <label
                key={item.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors focus-within:ring-2 focus-within:ring-primary-solid",
                  workflow === item.id
                    ? "border-primary-solid bg-primary-element"
                    : "border-muted hover:bg-muted-element",
                )}
              >
                <input
                  type="radio"
                  name="cloud-agent-workflow"
                  value={item.id}
                  checked={workflow === item.id}
                  onChange={() => {
                    setWorkflow(item.id);
                    if (item.id === "local" && !supportsLocalApp(selected)) {
                      setSelected("claude");
                    }
                  }}
                  className="mt-1 size-4 shrink-0 accent-primary-solid"
                />
                <span>
                  <span className="block text-base font-semibold leading-6 text-muted-high-contrast">
                    {item.name}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-muted-base">
                    {item.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-3 text-base font-semibold text-muted-high-contrast">
            {workflow === "railway"
              ? "2. Choose your coding agent"
              : "2. Choose your app"}
          </legend>
          <div
            className={cn(
              "grid grid-cols-2 gap-2",
              workflow === "railway" ? "sm:grid-cols-3" : "sm:grid-cols-2",
            )}
          >
            {choices.map(item => (
              <label
                key={item.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-primary-solid",
                  selected === item.id
                    ? "border-primary-solid bg-primary-element text-primary-high-contrast"
                    : "border-muted text-muted-high-contrast hover:bg-muted-element",
                )}
              >
                <input
                  type="radio"
                  name="cloud-agent-client"
                  value={item.id}
                  checked={selected === item.id}
                  onChange={() => setSelected(item.id)}
                  className="size-3.5 shrink-0 accent-primary-solid"
                />
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {workflow === "local" && openCode && (
          <fieldset>
            <legend className="mb-3 text-base font-semibold text-muted-high-contrast">
              3. Choose your local interface
            </legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "desktop", name: "Desktop app" },
                  { id: "local", name: "Local terminal client" },
                ] as const
              ).map(item => (
                <label
                  key={item.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-primary-solid",
                    localInterface === item.id
                      ? "border-primary-solid bg-primary-element text-primary-high-contrast"
                      : "border-muted text-muted-high-contrast hover:bg-muted-element",
                  )}
                >
                  <input
                    type="radio"
                    name="cloud-agent-mode"
                    value={item.id}
                    checked={localInterface === item.id}
                    onChange={() => setLocalInterface(item.id)}
                    className="size-3.5 accent-primary-solid"
                  />
                  {item.name}
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>
      <div
        className="border-t border-muted px-5 pb-5"
        aria-live="polite"
        aria-atomic="true"
      >
        <CodeBlock code={command} lang="bash" />
        <p className="text-sm leading-6">{next}</p>
        {selected === "opencode2" && (
          <p className="text-sm text-muted-base">
            The first Beta startup downloads its runtime and can take several
            minutes.
          </p>
        )}
        <Link
          href={mode === "remote" ? "/cloud-agents/terminal" : client!.href}
          className="text-sm"
        >
          {mode === "remote"
            ? "Read the terminal sessions guide →"
            : `Read the ${client!.name} guide →`}
        </Link>
      </div>
      <div className="border-t border-muted bg-muted-element/40 px-5 py-4 text-sm leading-6 text-muted-base">
        The agent stays running when you disconnect. Use{" "}
        <code>railway ca sleep &lt;agent-name&gt;</code> to stop compute and
        keep your files.
      </div>
    </div>
  );
}

export function CloudAgentConnection({
  app,
  transport = "SSH",
}: {
  app: string;
  transport?: "SSH" | "HTTPS" | "SSH or HTTPS";
}) {
  return (
    <figure
      className="not-prose my-7 rounded-xl border border-muted bg-muted-app-subtle p-5"
      aria-label={`${app} on your computer connects over ${transport} to a Railway cloud agent, where coding tools and project files live.`}
    >
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-lg border border-muted bg-muted-app p-4">
          <Icon name="Monitor" className="mb-3 size-5 text-muted-base" />
          <div className="text-xs text-muted-base">YOUR COMPUTER</div>
          <div className="mt-1 font-medium">{app}</div>
          <div className="mt-1 text-sm text-muted-base">
            Prompts, review, and approvals
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-base">
          <span aria-hidden="true">↔</span>
          {transport}
          <span aria-hidden="true">↔</span>
        </div>
        <div className="rounded-lg border border-muted bg-primary-element/30 p-4">
          <Icon
            name="Railway"
            className="mb-3 size-5 text-primary-high-contrast"
          />
          <div className="text-xs text-muted-base">RAILWAY CLOUD AGENT</div>
          <div className="mt-1 font-medium">Your development environment</div>
          <div className="mt-1 text-sm text-muted-base">
            Coding tools, terminal, and files
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs leading-5 text-muted-base">
        Work happens on Railway. Your project files stay on the agent’s
        persistent disk.
      </figcaption>
    </figure>
  );
}
