import { NextPage } from "next";
import NextImage from "next/image";
import React from "react";
import tw, { styled } from "twin.macro";
import { DiscordIcon, RssIcon, TwitterIcon } from "../components/Icons";
import { Link } from "../components/Link";
import { Page } from "../layouts/Page";
import { GitHub, ArrowRight, Zap, Code, Database, Book } from "react-feather";

const Home: NextPage = () => {
  return (
    <>
      <div tw="max-w-4xl">
        <h1 tw="text-5xl md:text-6xl font-bold mb-12">Introduction</h1>
        {/* Need to make this mobile friendly */}
        <div
          css={[
            `background: linear-gradient(83.84deg, rgba(149, 203, 233, 0.9) -3.34%, rgba(71, 201, 242, 0.135) 35.77%), linear-gradient(101.71deg, rgba(227, 167, 228, 0.048) 46.42%, rgba(238, 96, 215, 0.8) 94.51%), linear-gradient(149.12deg, #3308AD 13.67%, rgba(51, 8, 173, 0) 86.42%);`,
            tw`flex relative rounded-md w-full overflow-hidden`,
          ]}
        >
          <div tw="py-12 pl-12 z-10">
            <div tw="text-3xl font-bold text-white mb-4">Quickstart Guide</div>
            <div tw="text-xl font-normal text-white mb-12 max-w-md">
              A short guide on making your first deploy on Railway in a couple
              of minutes.
            </div>
            <ButtonLink
              href="/getting-started"
              tw="w-40 bg-pink-700 text-white text-center text-lg hover:bg-pink-500"
            >
              <div tw="flex flex-row justify-center items-center font-semibold">
                <ArrowRight tw="mr-1" />
                Get Started
              </div>
            </ButtonLink>
          </div>
          <div tw="absolute -bottom-8 right-0 opacity-50 z-0 lg:opacity-100">
            <NextImage
              src="/images/code-terminal.svg"
              alt="Graphic of Terminal"
              tw=""
              layout="intrinsic"
              height={350}
              width={310}
              quality={100}
            />
          </div>
        </div>

        <div tw="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <OverviewLink href="reference/starters">
            <OverviewLinkIcon>
              <Zap size="28" tw="text-pink-800" />
            </OverviewLinkIcon>
            <OverviewLinkTextbox tw="">
              <OverviewLinkHeading>Starters</OverviewLinkHeading>
              <OverviewLinkText>
                See all starters you can deploy to get up and running on
                Railway.
              </OverviewLinkText>
            </OverviewLinkTextbox>
          </OverviewLink>
          <OverviewLink href="deploy/builds">
            <OverviewLinkIcon>
              <Code size="28" tw="text-pink-800" />
            </OverviewLinkIcon>
            <OverviewLinkTextbox tw="">
              <OverviewLinkHeading>Language Specific Apps</OverviewLinkHeading>
              <OverviewLinkText>
                Get information on how to deploy specific applications.
              </OverviewLinkText>
            </OverviewLinkTextbox>
          </OverviewLink>
          <OverviewLink href="develop/variables">
            <OverviewLinkIcon>
              <Database size="28" tw="text-pink-800" />
            </OverviewLinkIcon>
            <OverviewLinkTextbox tw="">
              <OverviewLinkHeading>Variables</OverviewLinkHeading>
              <OverviewLinkText>
                Understand how Railway handles variables on the platform.
              </OverviewLinkText>
            </OverviewLinkTextbox>
          </OverviewLink>
          <OverviewLink href="reference/guides">
            <OverviewLinkIcon>
              <Book size="28" tw="text-pink-800" />
            </OverviewLinkIcon>
            <OverviewLinkTextbox tw="">
              <OverviewLinkHeading>Guides</OverviewLinkHeading>
              <OverviewLinkText>
                Tutorials on common developer scenarios.
              </OverviewLinkText>
            </OverviewLinkTextbox>
          </OverviewLink>
        </div>
        <div tw="grid grid-cols-1 mt-14 items-center md:grid-cols-8">
          <div tw="bg-gray-100 rounded-md col-span-5 p-6">
            <div tw="flex text-base font-semibold mb-4">
              <GitHub tw="mr-2" /> Contributing
            </div>
            <div>
              <div>
                Each page footer contains an "Edit on GitHub" Link. Make a pull
                request, and we'll merge it!
              </div>
              <Link
                tw="flex text-pink-800 items-center mt-2 hover:text-pink-600"
                href="https://github.com/railwayapp/docs"
              >
                <span tw="mr-2">Docs Repository</span> <ArrowRight />
              </Link>
            </div>
          </div>
          <div tw="mt-8 flex flex-col ml-8 col-span-3 gap-4 md:mt-0">
            <OverviewSecondaryLink href="https://discord.gg/railway">
              <DiscordIcon tw="w-8 h-8" />
              <div>Join our Discord Server </div>
              <ArrowRight />
            </OverviewSecondaryLink>
            <OverviewSecondaryLink href="https://railway.app/changelog">
              <RssIcon tw="w-8 h-8 text-pink-700" />
              Check out the Changelog <ArrowRight />
            </OverviewSecondaryLink>
            <OverviewSecondaryLink href="https://twitter.com/Railway">
              <TwitterIcon tw="w-8 h-8" />
              Follow Us on Twitter <ArrowRight />
            </OverviewSecondaryLink>
          </div>
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
  ${tw`flex border border-gray-100 rounded-md p-6 hover:bg-gray-100 hover:shadow-lg`}
`;

const OverviewLinkIcon = styled.div`
  ${tw`flex border border-pink-200 items-center p-4 h-16 w-16 rounded-md bg-background`}
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
  ${tw`flex items-center gap-2 hover:text-pink-700`}
`;
