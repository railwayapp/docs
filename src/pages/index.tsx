import { NextPage } from "next";
import React from "react";
import tw, { styled } from "twin.macro";
import { DiscordIcon, RssIcon, TwitterIcon } from "../components/Icons";
import { Link } from "../components/Link";
import { Page } from "../layouts/Page";
import { GitHub } from "react-feather";

const Home: NextPage = () => {
  return (
    <Page>
      <div>
        <h1 tw="text-5xl md:text-6xl font-bold mb-12">Railway Docs</h1>

        <div tw="flex items-center space-x-4 mb-8">
          <ButtonLink
            href="/getting-started"
            css={[
              tw`bg-foreground border-2 border-foreground text-background`,
              tw`hover:bg-background hover:text-foreground`,
              tw`focus:ring-2 focus:ring-pink-700`,
            ]}
          >
            Get Started
          </ButtonLink>

          <ButtonLink
            href="https://railway.app"
            css={[
              tw`bg-pink-500 text-white border-2 border-pink-500`,
              tw`hover:bg-pink-400`,
              tw`focus:ring-2 focus:ring-pink-700`,
            ]}
          >
            Visit Railway
          </ButtonLink>
        </div>

        <div tw="prose mt-16">
          <section>
            <h2>Connect with Us</h2>

            <h3 tw="flex items-center space-x-4">
              <RssIcon /> <span>Changelog</span>
            </h3>
            <p>
              Weekly update with features and improvements made to Railway.{" "}
              <br />
              <Link href="https://railway.app/changelog">View Changelog</Link>
            </p>

            <h3 tw="flex items-center space-x-4">
              <TwitterIcon /> <span>Twitter</span>
            </h3>
            <p>
              Keep up with the latest news and updates. <br />
              <Link href="https://twitter.com/Railway_App">
                Follow @Railway_App
              </Link>
            </p>

            <h3 tw="flex items-center space-x-4">
              <DiscordIcon /> <span>Discord</span>
            </h3>
            <p>
              Chat with our Railway members, ask questions, hang out.
              <br />
              <Link href="https://discord.gg/xAm2w6g">Join Discord</Link>
            </p>
            <h3 tw="flex items-center space-x-4">
              <GitHub /> <span>Contributing</span>
            </h3>
            <p>
              Each page footer contains an "Edit on GitHub Link". Change the
              markdown, make a pull request, and we'll merge it! Deploys will
              happen automagically cause the blog is hosted on Railway.
              <br />
              <Link href="https://github.com/railwayapp/docs">Doc Source</Link>
            </p>
          </section>
        </div>
      </div>
    </Page>
  );
};

export default Home;

const ButtonLink = styled(Link)`
  ${tw`block font-medium rounded shadow`}
  ${tw`px-3 py-2`}
  ${tw`focus:outline-none`}
`;
