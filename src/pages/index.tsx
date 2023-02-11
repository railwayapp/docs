import { NextPage } from "next";
import NextImage from "next/image";
import React from "react";
import tw, { styled } from "twin.macro";
import { DiscordIcon, RssIcon, TwitterIcon } from "../components/Icons";
import { Link } from "../components/Link";
import {
  ArrowRight,
  Book,
  Code,
  Layers,
  Edit3,
  GitPullRequest,
} from "react-feather";

export const Background = () => (
  <div tw="opacity-50 md:opacity-100 absolute inset-0 pointer-events-none">
    <img
      src="/images/VectorGrid.svg"
      tw="absolute top-0 right-0 transform scale-x-[-1] max-w-none"
    />
  </div>
);

const Home: NextPage = () => {
  return (
    <>
      <div tw="max-w-4xl z-10">
        <h1 tw="text-5xl md:text-6xl font-bold mb-12">Introduction</h1>
        <div
          // I know this is the longest single line of css I've ever written
          css={[
            tw`background[linear-gradient(83.84deg, rgba(149, 203, 233, 0.9) -3.34%, rgba(71, 201, 242, 0.135) 35.77%), linear-gradient(101.71deg, rgba(227, 167, 228, 0.048) 46.42%, rgba(238, 96, 215, 0.8) 94.51%), linear-gradient(149.12deg, #3308AD 13.67%, rgba(51, 8, 173, 0) 86.42%)] dark:background[linear-gradient(31.2deg, #0B4347 -25.4%, rgba(9, 36, 45, 0.15) 80.73%), linear-gradient(109.68deg, rgba(60, 0, 61, 0.01) 30.31%, #20041C 85.93%), linear-gradient(149.12deg, #1B0066 13.67%, rgba(28, 0, 108, 0) 86.42%)]`,
            tw`flex relative rounded-md w-full overflow-hidden border`,
          ]}
        >
          <div tw="py-12 pl-12 z-10">
            <div tw="text-3xl font-bold text-white mb-4">Quickstart Guide</div>
            <div tw="text-xl font-normal text-white dark:text-gray-600 mb-12 max-w-md">
              A short guide on making your first deploy on Railway in a couple
              of minutes.
            </div>
            <ButtonLink
              href="/getting-started"
              tw="w-40 bg-pink-400 text-white text-center text-lg hover:bg-pink-500"
            >
              <div tw="flex flex-row justify-center items-center font-semibold">
                <ArrowRight tw="mr-1" />
                Get Started
              </div>
            </ButtonLink>
          </div>
          <div tw="absolute -bottom-20 -right-4 opacity-25 z-0 lg:opacity-100">
            <NextImage
              src="/images/code-terminal.svg"
              alt="Graphic of Terminal"
              tw=""
              layout="intrinsic"
              height={460}
              width={417}
              quality={100}
            />
          </div>
        </div>

        <div tw="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <OverviewLink href="reference/templates">
            <OverviewLinkIcon tw="bg-pink-100 border-pink-100 dark:bg-[#291839]">
              <Layers size="28" tw="text-pink-800" />
            </OverviewLinkIcon>
            <OverviewLinkTextbox>
              <OverviewLinkHeading>Templates</OverviewLinkHeading>
              <OverviewLinkText>
                See all templates you can deploy to get up and running on
                Railway.
              </OverviewLinkText>
            </OverviewLinkTextbox>
          </OverviewLink>
          <OverviewLink href="deploy/builds">
            <OverviewLinkIcon tw="bg-blue-100 border-blue-100 dark:bg-[#0F1B33]">
              <Code size="28" tw="text-blue-800" />
            </OverviewLinkIcon>
            <OverviewLinkTextbox>
              <OverviewLinkHeading>Language Specific Apps</OverviewLinkHeading>
              <OverviewLinkText>
                Get information on how to deploy specific applications.
              </OverviewLinkText>
            </OverviewLinkTextbox>
          </OverviewLink>
          <OverviewLink href="develop/variables">
            <OverviewLinkIcon tw="bg-yellow-100 border-yellow-200 dark:border-yellow-100 dark:bg-[#1D190C]">
              <Edit3 size="28" tw="text-yellow-800" />
            </OverviewLinkIcon>
            <OverviewLinkTextbox>
              <OverviewLinkHeading>Variables</OverviewLinkHeading>
              <OverviewLinkText>
                Understand how Railway handles variables on the platform.
              </OverviewLinkText>
            </OverviewLinkTextbox>
          </OverviewLink>
          <OverviewLink href="reference/guides">
            <OverviewLinkIcon tw="bg-green-100 border-green-100 dark:bg-[#15231D]">
              <Book size="28" tw="text-green-800" />
            </OverviewLinkIcon>
            <OverviewLinkTextbox>
              <OverviewLinkHeading>Guides</OverviewLinkHeading>
              <OverviewLinkText>
                Tutorials on common developer scenarios.
              </OverviewLinkText>
            </OverviewLinkTextbox>
          </OverviewLink>
        </div>
        <div tw="flex mt-14 items-center">
          <div tw="bg-gradient-to-r dark:from-[#1A1432] rounded-md p-6 border flex flex-col items-start md:flex-row md:items-center w-full">
            <div tw="bg-gray-100 border p-4 rounded">
              <GitPullRequest size="28" tw="text-gray-800" />
            </div>
            <div tw="md:ml-4 flex-1">
              <p tw="py-2">
                <span tw="font-bold">How to Contribute</span>{" "}
                <span tw="text-gray-500">
                  — Each page footer contains an "
                  <span tw="font-bold">Edit on GitHub</span>" Link. Change the
                  markdown, make a pull request, and we'll merge it!
                </span>
              </p>
            </div>
            <ButtonLink
              href="https://github.com/railwayapp/docs"
              tw="bg-gray-100 border-gray-100 text-gray-800 hover:bg-gray-200 md:ml-4"
            >
              <div tw="flex flex-row justify-center items-center font-semibold">
                <ArrowRight tw="mr-1" />
                Docs Repo
              </div>
            </ButtonLink>
          </div>
        </div>
        <div tw="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <OverviewSecondaryLink href="https://discord.gg/railway">
            <DiscordIcon tw="w-8 h-8" />
            <div>Join our Discord Server </div>
          </OverviewSecondaryLink>
          <OverviewSecondaryLink href="https://railway.app/changelog">
            <RssIcon tw="w-8 h-8 bg-pink-700" />
            Check out the Changelog
          </OverviewSecondaryLink>
          <OverviewSecondaryLink href="https://twitter.com/Railway">
            <TwitterIcon tw="w-8 h-8" />
            Follow @Railway on Twitter
          </OverviewSecondaryLink>
        </div>
      </div>
    </>
  );
};

export default Home;

const ButtonLink = styled(Link)`
  ${tw`block font-medium rounded shadow`}
  ${tw`px-3 py-2`}
  ${tw`focus:outline-none`}
`;

const OverviewLink = styled(Link)`
  ${tw`flex border border-gray-100 rounded-md dark:bg-[#181622] p-6 hover:bg-gray-100 hover:shadow-lg`}
`;

const OverviewLinkIcon = styled.div`
  ${tw`flex border items-center p-4 h-16 w-16 rounded-md bg-background`}
`;

const OverviewLinkTextbox = styled.div`
  ${tw`ml-6`}
`;

const OverviewLinkHeading = styled.div`
  ${tw`font-semibold text-lg mb-1`}
`;

const OverviewLinkText = styled.div`
  ${tw`font-normal text-base text-gray-600`}
`;

const OverviewSecondaryLink = styled(Link)`
  ${tw`flex items-center text-gray-600 gap-2 hover:text-pink-700`}
`;
