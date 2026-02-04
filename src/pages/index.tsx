import { NextPage } from "next";
import { Link } from "../components/link";
import { Icon } from "../components/icon";
import { ThemeSwitcher } from "../components/theme-switcher";

const Home: NextPage = () => {
  return (
    <>
      <div className="max-w-5xl mx-auto z-10">
        {/* Hero Section */}
        <div className="mb-12">
          <h1
            className="text-4xl mb-4 text-foreground font-serif font-medium"
            style={{
              lineHeight: 1.13,
              letterSpacing: "-0.035em",
              fontSize: "2.5rem",
            }}
          >
            Railway Documentation
          </h1>
          <p className="text-lg text-muted-base">
            Railway is an all-in-one intelligent cloud provider that makes it
            easy to provision infrastructure, develop locally, and deploy to the
            cloud.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
          {/* Quick Start Card */}
          <Link href="/quick-start">
            <div className="group relative h-40 md:h-56 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 bg-gradient-to-br from-[#EFD580]/25 to-white hover:from-[#EFD580]/40 hover:to-white dark:from-[#675518]/25 dark:to-[#131415] dark:hover:from-[#675518]/40 dark:hover:to-[#131415] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-muted">
              <img
                src="/images/card-light-quickstart.svg"
                alt=""
                className="absolute bottom-0 right-0 w-auto h-auto max-h-full pointer-events-none dark:hidden"
              />
              <img
                src="/images/card-dark-quickstart.svg"
                alt=""
                className="absolute bottom-0 right-0 w-auto h-auto max-h-full pointer-events-none hidden dark:block"
              />
              <div className="relative z-10 p-6">
                <div
                  className="font-medium mb-1 text-foreground text-lg"
                  style={{ letterSpacing: "-0.25px" }}
                >
                  Quick Start
                </div>
                <div className="text-muted-base text-base font-normal max-w-[20rem] md:max-w-[16rem]">
                  Deploy in minutes. Jump into our quickstart guide to get your
                  first app running.
                </div>
              </div>
            </div>
          </Link>

          {/* AI Card */}
          <Link href="/ai">
            <div className="group relative h-40 md:h-56 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 bg-gradient-to-br from-[#8CAEF2]/25 to-white hover:from-[#8CAEF2]/40 hover:to-white dark:from-[#1D4596]/25 dark:to-[#131415] dark:hover:from-[#1D4596]/40 dark:hover:to-[#131415] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-muted">
              <img
                src="/images/card-light-how-railway-works.svg"
                alt=""
                className="absolute bottom-0 right-0 w-auto h-auto max-h-full pointer-events-none dark:hidden"
              />
              <img
                src="/images/card-dark-how-railway-works.svg"
                alt=""
                className="absolute bottom-0 right-0 w-auto h-auto max-h-full pointer-events-none hidden dark:block"
              />
              <div className="relative z-10 p-6">
                <div
                  className="font-medium mb-1 text-foreground text-lg"
                  style={{ letterSpacing: "-0.25px" }}
                >
                  AI
                </div>
                <div className="text-muted-base text-base font-normal max-w-[20rem] md:max-w-[16rem]">
                  Build with Railway using Agent Skills and the MCP server for
                  AI-powered workflows.
                </div>
              </div>
            </div>
          </Link>

          {/* CLI Card */}
          <Link href="/cli">
            <div className="group relative h-40 md:h-56 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 bg-gradient-to-br from-[#F1C1C0]/25 to-white hover:from-[#F1C1C0]/40 hover:to-white dark:from-[#741D1B]/25 dark:to-[#131415] dark:hover:from-[#741D1B]/40 dark:hover:to-[#131415] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-muted">
              <img
                src="/images/card-light-guides.svg"
                alt=""
                className="absolute bottom-0 right-0 w-auto h-auto max-h-full pointer-events-none dark:hidden"
              />
              <img
                src="/images/card-dark-guides.svg"
                alt=""
                className="absolute bottom-0 right-0 w-auto h-auto max-h-full pointer-events-none hidden dark:block"
              />
              <div className="relative z-10 p-6">
                <div
                  className="font-medium mb-1 text-foreground text-lg"
                  style={{ letterSpacing: "-0.25px" }}
                >
                  CLI
                </div>
                <div className="text-muted-base text-base font-normal max-w-[20rem] md:max-w-[16rem]">
                  Develop locally and deploy from your terminal with the Railway
                  CLI.
                </div>
              </div>
            </div>
          </Link>

          {/* Templates Card */}
          <Link href="/templates">
            <div className="group relative h-40 md:h-56 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 bg-gradient-to-br from-[#95D0B4]/25 to-white hover:from-[#95D0B4]/40 hover:to-white dark:from-[#26543F]/25 dark:to-[#131415] dark:hover:from-[#26543F]/40 dark:hover:to-[#131415] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-muted">
              <img
                src="/images/card-light-tutorials.svg"
                alt=""
                className="absolute bottom-0 right-0 w-auto h-auto max-h-full pointer-events-none dark:hidden"
              />
              <img
                src="/images/card-dark-tutorials.svg"
                alt=""
                className="absolute bottom-0 right-0 w-auto h-auto max-h-full pointer-events-none hidden dark:block"
              />
              <div className="relative z-10 p-6">
                <div
                  className="font-medium mb-1 text-foreground text-lg"
                  style={{ letterSpacing: "-0.25px" }}
                >
                  Templates
                </div>
                <div className="text-muted-base text-base font-normal max-w-[20rem] md:max-w-[16rem]">
                  One-click deployable applications and starters for common use
                  cases.
                </div>
              </div>
            </div>
          </Link>
        </div>

        <footer className="mt-32 border-t border-muted/70 pt-8 pb-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="https://x.com/Railway"
                className="text-muted-base hover:text-muted-high-contrast transition-colors"
              >
                <Icon name="XIcon" className="size-4" />
              </Link>
              <Link
                href="https://discord.gg/railway"
                className="text-muted-base hover:text-muted-high-contrast transition-colors"
              >
                <Icon name="Discord" className="size-4" />
              </Link>
              <Link
                href="https://youtube.com/@railwayapp"
                className="text-muted-base hover:text-muted-high-contrast transition-colors"
              >
                <Icon name="Youtube" className="size-4" />
              </Link>
              <Link
                href="https://github.com/railwayapp/docs"
                className="text-muted-base hover:text-muted-high-contrast transition-colors"
              >
                <Icon name="Github" className="size-4" />
              </Link>
            </div>
            <ThemeSwitcher />
          </div>
        </footer>
      </div>
      <Background />
    </>
  );
};

export default Home;

export const Background = () => (
  <div className="opacity-50 md:opacity-100 absolute inset-0 pointer-events-none"></div>
);
