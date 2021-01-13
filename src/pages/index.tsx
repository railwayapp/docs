import { NextPage } from "next";
import React from "react";
import { DocsLayout } from "../layouts/DocsLayout";
import { Page } from "../layouts/Page";
import { Post } from "../types";

export interface Props {
  posts: Post[];
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <DocsLayout>
      <div className="max-w-4xl px-4 mx-auto">
        <header className="py-20">
          <h1 className="text-6xl font-bold text-center">Railway Docs</h1>
        </header>
      </div>
    </DocsLayout>
  );
};

export default Home;
