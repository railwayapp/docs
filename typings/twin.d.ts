// twin.d.ts
import "twin.macro";
import styledImport, { CSSProp, css as cssImport } from "styled-components";
import {} from "styled-components/cssprop";

declare module "twin.macro" {
  // The styled and css imports
  const styled: typeof styledImport;
  const css: typeof cssImport;
}

declare module "react" {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp;
    tw?: string;
  }

  // The inline svg css prop
  interface SVGProps<T> {
    css?: CSSProp;
    tw?: string;
  }

  // <style jsx> and <style jsx global> support for styled-jsx
  interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

// Do not override JSX.IntrinsicAttributes to preserve React's built-in `key`/`ref` types
