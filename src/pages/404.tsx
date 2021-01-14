import React from "react";
import { Page } from "../layouts/Page";
import "twin.macro";

const NotFoundPage: React.FC = () => (
  <Page seo={{ title: "Not Found" }}>
    <div tw="prose">
      <h1>Page not found</h1>

      <p>Maybe you were looking for one of the following</p>
    </div>
  </Page>
);

export default NotFoundPage;
