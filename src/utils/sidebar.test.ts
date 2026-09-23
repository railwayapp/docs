import assert from "node:assert/strict";
import test from "node:test";
import { sidebarContent } from "../data/sidebar";
import { buildBreadcrumbs } from "./seo";
import {
  containingSubsectionSlugs,
  flattenSidebarItems,
  sidebarItemContainsPage,
} from "./sidebar";
import type { ISidebarItem } from "../types";

const ai = sidebarContent.find(section => section.slug === "/ai")!;
const opencode = "/cloud-agents/opencode";

test("a direct OpenCode link expands Cloud agents", () => {
  assert.deepEqual(containingSubsectionSlugs(ai.content, opencode), [
    "/cloud-agents",
  ]);
  assert.ok(ai.content.some(item => sidebarItemContainsPage(item, opencode)));
  assert.deepEqual(
    containingSubsectionSlugs(ai.content, "/cloud-agents/claude"),
    ["/cloud-agents"],
  );
  assert.deepEqual(
    containingSubsectionSlugs(ai.content, "/does-not-exist"),
    [],
  );
});

test("OpenCode breadcrumbs follow the Cloud agents hierarchy and existing breadcrumbs retain theirs", () => {
  assert.deepEqual(
    buildBreadcrumbs(opencode).map(item => item.url),
    ["/", "/ai", "/cloud-agents", opencode],
  );
  assert.deepEqual(
    buildBreadcrumbs("/ai/codex-plugin").map(item => item.url),
    ["/", "/ai", "/ai/plugins-and-connectors", "/ai/codex-plugin"],
  );
});

test("previous and next page order includes the OpenCode page once", () => {
  const pages = flattenSidebarItems(ai.content).map(page => page.slug);
  const position = pages.indexOf(opencode);
  assert.ok(position > 0);
  assert.equal(pages[position - 1], "/cloud-agents/codex");
  assert.equal(pages[position + 1], "/cloud-agents/manage");
  assert.equal(pages.filter(slug => slug === opencode).length, 1);
  assert.equal(pages.includes("/cloud-agents/opencode/beta"), false);
});

test("nested named sections and external links do not become internal pages", () => {
  const items: ISidebarItem[] = [
    {
      subTitle: "Named group",
      pages: [
        { title: "External", url: "https://example.com" },
        {
          subTitle: { title: "Parent", slug: "/parent" },
          pages: [{ title: "Child", slug: "/child" }],
        },
      ],
    },
  ];
  assert.deepEqual(
    flattenSidebarItems(items).map(page => page.slug),
    ["/parent", "/child"],
  );
  assert.deepEqual(containingSubsectionSlugs(items, "/child"), [
    "Named group",
    "/parent",
  ]);
  assert.equal(sidebarItemContainsPage(items[0], "https://example.com"), false);
});
