import React from "react";
import "twin.macro";
import { Link } from "../components/Link";
import { SEO } from "../components/SEO";

const NotFoundPage: React.FC = () => (
  <>
    <SEO title="Not Found" />
    <div tw="prose dark:prose-invert">
      <h1>Page not found</h1>

      <p>Maybe you were looking for one of the following</p>

      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/quick-start">Quick Start</Link>
        </li>
        <li>
          <Link href="/tutorials/getting-started">Tutorials</Link>
        </li>
        <li>
          <Link href="/guides/cli">CLI Quick Start</Link>
        </li>
        <li>
          <Link href="/guides/cli#deploy">Railway Up</Link>
        </li>
      </ul>
    </div>
  </>
);

export default NotFoundPage;
