import React from "react";
import { Page } from "../layouts/Page";
import "twin.macro";
import { Link } from "../components/Link";

const NotFoundPage: React.FC = () => (
  <Page seo={{ title: "Not Found" }}>
    <div tw="prose">
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
          <Link href="/cli/quick-start">CLI Quick Start</Link>
        </li>
        <li>
          <Link href="/deployment/up">Railway Up</Link>
        </li>
      </ul>
    </div>
  </Page>
);

export default NotFoundPage;
