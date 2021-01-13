import { NextPage } from "next";
import React from "react";
import { Page } from "../layouts/Page";

const Home: NextPage = () => {
  return (
    <Page>
      <div className="max-w-4xl px-4 mx-auto">
        <header className="py-20">
          <h1 className="text-6xl font-bold text-center">Railway Docs</h1>
        </header>
      </div>
    </Page>
  );
};

export default Home;
