# GraphQL Code Snippet Indentation Issues

## Summary
Found 3 indentation-related issues in `src/components/graphql-code-tabs.tsx` that affect the formatting of generated code snippets for JavaScript and Python.

## Issues Found

### Issue 1: JavaScript Variables Indentation (Lines 472-476)
**Location**: `generateJavaScript()` function

**Current Code**:
```typescript
const varsStr = variables
  ? `\n    variables: ${JSON.stringify(variables, null, 2)
      .split("\n")
      .join("\n    ")},`
  : "";
```

**Problem**: 
- `JSON.stringify(variables, null, 2)` already produces indented JSON with 2-space indentation
- The `.split("\n").join("\n    ")` adds 4 additional spaces to EVERY line
- This causes the first line of variables to have correct indentation but subsequent lines get double-indented
- Example output becomes misaligned:
```javascript
variables: {
    "key": "value",  // Correct
    "nested": {      // Correct
        "deep": "value"  // WRONG: 8 spaces instead of 4
    }
}
```

**Root Cause**: The indentation logic doesn't account for the fact that `JSON.stringify(null, 2)` already includes 2-space indentation. Adding 4 more spaces creates 6-space indentation for nested properties.

---

### Issue 2: Python Variables Indentation (Lines 497-501)
**Location**: `generatePython()` function

**Current Code**:
```typescript
const varsStr = variables
  ? `\n        "variables": ${JSON.stringify(variables, null, 2)
      .split("\n")
      .join("\n        ")},`
  : "";
```

**Problem**:
- Similar to Issue 1, but with 8 spaces instead of 4
- The JSON is already indented by 2 spaces from `JSON.stringify(null, 2)`
- Adding 8 more spaces creates 10-space indentation for nested properties
- This breaks the visual alignment in the Python code block

**Root Cause**: Same as Issue 1 - not accounting for existing JSON indentation.

---

### Issue 3: Fallback HTML Rendering (Lines 184-189)
**Location**: Error fallback in `GraphQLCodeTabs` component's highlight effect

**Current Code**:
```typescript
const escapedCode = activeCode
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");
const lines = escapedCode
  .split("\n")
  .map(line => `<span class="line">${line}</span>`)
  .join("\n");
```

**Problem**:
- When Shiki highlighting fails, the fallback doesn't preserve indentation in the HTML output
- The `<span class="line">` wrapper doesn't include any CSS classes to preserve whitespace
- This can cause code to appear unindented in the fallback rendering

**Root Cause**: The fallback HTML doesn't use `white-space: pre` or similar CSS to preserve leading whitespace.

---

## Solution

### Fix for Issues 1 & 2: Proper Indentation Handling

Instead of blindly adding spaces to every line, we need to:
1. Get the base indentation level needed for the context
2. Only add the ADDITIONAL indentation needed, not the full amount
3. Account for the fact that JSON.stringify already indents

**Corrected JavaScript**:
```typescript
const varsStr = variables
  ? `\n    variables: ${JSON.stringify(variables, null, 2)
      .split("\n")
      .map((line, i) => i === 0 ? line : "    " + line)
      .join("\n")},`
  : "";
```

**Corrected Python**:
```typescript
const varsStr = variables
  ? `\n        "variables": ${JSON.stringify(variables, null, 2)
      .split("\n")
      .map((line, i) => i === 0 ? line : "        " + line)
      .join("\n")},`
  : "";
```

The key difference: Use `.map((line, i) => i === 0 ? line : "    " + line)` instead of `.split("\n").join("\n    ")`. This:
- Keeps the first line as-is (it's already positioned correctly)
- Only adds indentation to subsequent lines
- Preserves the relative indentation of the JSON structure

### Fix for Issue 3: Fallback HTML Indentation

Add `white-space: pre` to the fallback HTML:
```typescript
const fallback = `<pre class="shiki" style="white-space: pre;"><code>${lines}</code></pre>`;
```

Or better, use the existing Shiki CSS classes that should handle this.

---

## Testing

After applying fixes, verify:
1. JavaScript snippet with nested variables displays with correct indentation
2. Python snippet with nested variables displays with correct indentation
3. Fallback rendering (when Shiki fails) preserves indentation
4. All code tabs render consistently across light/dark themes

