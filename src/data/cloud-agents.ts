export const cloudAgentTools = [
  { id: "claude", name: "Claude Code" },
  { id: "codex", name: "Codex" },
  { id: "grok", name: "Grok" },
  { id: "railway", name: "Railway Agent" },
  { id: "opencode", name: "OpenCode" },
  { id: "opencode2", name: "OpenCode2 Beta" },
] as const;

export type CloudAgentTool = (typeof cloudAgentTools)[number]["id"];
export type CloudAgentMode = "remote" | "desktop" | "local";

export const cloudAgentClients = [
  {
    id: "claude",
    name: "Claude Desktop",
    icon: "Claude",
    description:
      "Choose Railway as your Claude Code environment and work from Desktop.",
    href: "/cloud-agents/claude",
  },
  {
    id: "codex",
    name: "Codex Desktop",
    icon: "Chatgpt",
    description:
      "Connect Codex to your cloud agent and open a remote project over SSH.",
    href: "/cloud-agents/codex",
  },
  {
    id: "opencode",
    name: "OpenCode",
    icon: "OpenCode",
    description:
      "Connect Desktop or your local terminal to a Railway server. Includes OpenCode2 Beta.",
    href: "/cloud-agents/opencode",
  },
  {
    id: "opencode2",
    name: "OpenCode2 Beta",
    icon: "OpenCode",
    description:
      "Connect Beta Desktop or its local terminal client to a Railway server.",
    href: "/cloud-agents/opencode/beta",
  },
] as const;

export function isOpenCode(tool: CloudAgentTool) {
  return tool === "opencode" || tool === "opencode2";
}

export function supportsLocalApp(tool: CloudAgentTool) {
  return cloudAgentClients.some(client => client.id === tool);
}

export function cloudAgentCommand(tool: CloudAgentTool, mode: CloudAgentMode) {
  if (mode === "desktop") {
    if (!supportsLocalApp(tool)) {
      throw new Error(`${tool} has no Desktop connection flow`);
    }
    return `railway ca desktop --${tool}`;
  }
  if (mode === "local" && !isOpenCode(tool)) {
    throw new Error(`${tool} has no local terminal connection flow`);
  }
  return `railway code --${tool}${mode === "remote" && isOpenCode(tool) ? " remote" : ""}`;
}
