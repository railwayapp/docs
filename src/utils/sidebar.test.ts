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
const beta = "/cloud-agents/opencode/beta";

test("a direct Beta link expands both Cloud agents and OpenCode", () => {
  assert.deepEqual(containingSubsectionSlugs(ai.content, beta), [
    "/cloud-agents",
    "/cloud-agents/opencode",
  ]);
  assert.ok(ai.content.some(item => sidebarItemContainsPage(item, beta)));
  assert.deepEqual(
    containingSubsectionSlugs(ai.content, "/cloud-agents/claude"),
    ["/cloud-agents"],
  );
  assert.deepEqual(
    containingSubsectionSlugs(ai.content, "/does-not-exist"),
    [],
  );
});

test("Beta breadcrumbs include OpenCode and existing breadcrumbs retain their hierarchy", () => {
  assert.deepEqual(
    buildBreadcrumbs(beta).map(item => item.url),
    ["/", "/ai", "/cloud-agents", "/cloud-agents/opencode", beta],
  );
  assert.deepEqual(
    buildBreadcrumbs("/ai/codex-plugin").map(item => item.url),
    ["/", "/ai", "/ai/plugins-and-connectors", "/ai/codex-plugin"],
  );
});

test("previous and next page order includes the nested Beta page once", () => {
  const pages = flattenSidebarItems(ai.content).map(page => page.slug);
  const position = pages.indexOf(beta);
  assert.ok(position > 0);
  assert.equal(pages[position - 1], "/cloud-agents/opencode");
  assert.equal(pages[position + 1], "/cloud-agents/manage");
  assert.equal(pages.filter(slug => slug === beta).length, 1);
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
