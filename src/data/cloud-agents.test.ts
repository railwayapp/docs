import assert from "node:assert/strict";
import test from "node:test";
import {
  cloudAgentClients,
  cloudAgentCommand,
  cloudAgentTools,
  supportsLocalApp,
  type CloudAgentMode,
  type CloudAgentTool,
} from "./cloud-agents";

const commands: [CloudAgentTool, CloudAgentMode, string][] = [
  ["claude", "remote", "railway code --claude"],
  ["codex", "remote", "railway code --codex"],
  ["grok", "remote", "railway code --grok"],
  ["railway", "remote", "railway code --railway"],
  ["opencode", "remote", "railway code --opencode remote"],
  ["claude", "desktop", "railway ca desktop --claude"],
  ["codex", "desktop", "railway ca desktop --codex"],
  ["opencode", "desktop", "railway ca desktop --opencode"],
  ["opencode", "local", "railway code --opencode"],
];

for (const [tool, mode, command] of commands) {
  test(`${tool} / ${mode} launches the requested interface`, () => {
    assert.equal(cloudAgentCommand(tool, mode), command);
  });
}

test("terminal-only agents are excluded from local app setup", () => {
  assert.equal(supportsLocalApp("grok"), false);
  assert.equal(supportsLocalApp("railway"), false);
  assert.deepEqual(
    cloudAgentTools
      .filter(tool => supportsLocalApp(tool.id))
      .map(tool => tool.id),
    cloudAgentClients.map(client => client.id),
  );
  for (const tool of ["grok", "railway"] as const) {
    assert.throws(() => cloudAgentCommand(tool, "desktop"));
  }
});

test("local terminal connections are offered only for OpenCode", () => {
  for (const tool of ["claude", "codex", "grok", "railway"] as const) {
    assert.throws(() => cloudAgentCommand(tool, "local"));
  }
});

test("there is a single OpenCode entry and no separate Beta edition", () => {
  assert.equal(
    cloudAgentTools.filter(tool => tool.id.startsWith("opencode")).length,
    1,
  );
  assert.equal(
    cloudAgentClients.filter(client => client.id.startsWith("opencode"))
      .length,
    1,
  );
});
