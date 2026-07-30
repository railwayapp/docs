// Shiki and its transformers load lazily so the ~420 KB highlighter chunk
// stays out of the initial page load. Callers render a same-geometry plain
// placeholder while this resolves, so the swap causes no layout shift.
export async function highlightWithShiki(
  code: string,
  lang: string,
  themes: { light: string; dark: string },
): Promise<string> {
  const [shiki, transformers] = await Promise.all([
    import("shiki"),
    import("@shikijs/transformers"),
  ]);
  const normalizedLang = lang.toLowerCase();
  const effectiveLang =
    normalizedLang in shiki.bundledLanguages ? normalizedLang : "plaintext";
  return shiki.codeToHtml(code, {
    lang: effectiveLang,
    themes,
    defaultColor: false,
    transformers: [
      transformers.transformerNotationDiff(),
      transformers.transformerNotationHighlight(),
      transformers.transformerNotationWordHighlight(),
      transformers.transformerRemoveLineBreak(),
    ],
  });
}
