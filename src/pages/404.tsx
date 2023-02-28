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
          <Link href="/getting-started">Getting Started</Link>
        </li>
        <li>
          <Link href="/develop/cli">CLI Quick Start</Link>
        </li>
        <li>
          <Link href="/deploy/railway-up">Railway Up</Link>
        </li>
      </ul>
    </div>
  </>
);

export default NotFoundPage;
