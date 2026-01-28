import { NextPage } from "next";
import { Youtube, GitHub } from "react-feather";
import tw, { styled } from "twin.macro";
import { DiscordIcon, XIcon } from "../components/Icons";
import { Link } from "../components/Link";

const Home: NextPage = () => {
  return (
    <>
      <div tw="max-w-3xl mx-auto z-10">
        {/* Hero Section */}
        <div tw="mb-12">
          <h1
            tw="text-4xl mb-4 text-gray-900"
            style={{
              fontFamily: "'IBM Plex Serif', serif",
              fontWeight: 500,
              lineHeight: 1.13,
              letterSpacing: "-0.035em",
              fontSize: "2.5rem",
            }}
          >
            Railway Documentation
          </h1>
          <p
            tw="text-lg text-gray-600 mb-6"
            style={{ color: "var(--colors-gray-700)" }}
            className="dark:!text-[var(--colors-gray-700)]"
          >
            Railway is all-in-one intelligent cloud provider that makes it easy
            to provision infrastructure, develop locally, and deploy to the
            cloud.
          </p>
          <div tw="flex flex-wrap gap-3">
            <PrimaryButton href="https://railway.com">
              Sign Up for Railway
            </PrimaryButton>
            <SecondaryButton href="/quick-start">
              Quick Start Guide
            </SecondaryButton>
          </div>
        </div>

        {/* Main Content */}
        <List>
          <li>
            <A href="/reference/ai">AI</A>: Build with Railway using{" "}
            <A href="/reference/ai/agent-skills">Agent Skills</A> and the{" "}
            <A href="/reference/ai/mcp-server">MCP server</A>.
          </li>

          <li>
            <A href="/guides/cli">CLI</A>: Develop locally and deploy from your
            terminal
          </li>
          <li>
            <A href="/guides/templates">Templates</A>: One-click deployable
            applications and starters
          </li>
          <li>
            <A href="/reference/deployments">Deployments</A>: Deploy via{" "}
            <A href="/guides/github-autodeploys">GitHub</A>,{" "}
            <A href="/guides/cli">CLI</A>, or{" "}
            <A href="/guides/dockerfiles">Dockerfile</A>. Configure{" "}
            <A href="/guides/healthchecks">healthchecks</A>,{" "}
            <A href="/reference/scaling">scaling</A>, and{" "}
            <A href="/reference/regions">regions</A>
          </li>
          <li>
            <A href="/guides/services">Services</A>: The building blocks of your
            project. Attach <A href="/guides/volumes">volumes</A> for persistent
            storage or run them as <A href="/guides/cron-jobs">cron jobs</A>
          </li>

          <li>
            <A href="/guides/databases">Databases</A>: Managed{" "}
            <A href="/guides/postgresql">PostgreSQL</A>,{" "}
            <A href="/guides/mysql">MySQL</A>, <A href="/guides/redis">Redis</A>
            , and <A href="/guides/mongodb">MongoDB</A> with automatic{" "}
            <A href="/reference/backups">backups</A>
          </li>

          <li>
            <A href="/guides/storage-buckets">Storage Buckets</A>: S3-compatible
            object storage for files and assets
          </li>

          <li>
            <A href="/guides/public-networking">Networking</A>: Expose services
            with <A href="/reference/public-domains">custom domains</A>, connect
            services via{" "}
            <A href="/guides/private-networking">private networking</A>, and
            configure <A href="/reference/tcp-proxy">TCP proxy</A> for non-HTTP
            traffic
          </li>

          <li>
            <A href="/guides/observability">Observability</A>: Monitor your apps
            with <A href="/guides/logs">logs</A>,{" "}
            <A href="/guides/metrics">metrics</A>, and{" "}
            <A href="/guides/webhooks">webhooks</A>
          </li>
        </List>

        {/* Footer */}
        <div tw="mt-12 pt-8 border-t border-gray-200">
          <div tw="flex flex-wrap gap-6 text-sm">
            <FooterLink href="https://github.com/railwayapp/docs">
              <GitHub size={16} />
              Contribute on GitHub
            </FooterLink>
            <FooterLink href="https://discord.gg/railway">
              <DiscordIcon tw="w-4 h-4" />
              Discord
            </FooterLink>
            <FooterLink href="https://x.com/Railway">
              <XIcon tw="w-4 h-4" />
              Twitter
            </FooterLink>
            <FooterLink href="https://youtube.com/@railwayapp">
              <Youtube size={16} />
              YouTube
            </FooterLink>
          </div>
        </div>
      </div>
      <Background />
    </>
  );
};

export default Home;

const PrimaryButton = styled(Link)`
  ${tw`inline-flex items-center px-4 py-2 rounded-md font-medium text-white`}
  background-color: var(--colors-pink-700);

  &:hover {
    background-color: var(--colors-pink-800);
  }
`;

const SecondaryButton = styled(Link)`
  ${tw`inline-flex items-center px-4 py-2 rounded-md font-medium border border-gray-200 text-gray-900`}

  &:hover {
    ${tw`bg-gray-100`}
  }
`;

const A = styled(Link)`
  color: var(--colors-pink-700);
  ${tw`font-medium`}

  &:hover {
    text-decoration: underline;
  }
`;

const List = styled.ul`
  ${tw`space-y-4`}

  li {
    ${tw`text-base leading-relaxed`}
    color: var(--colors-gray-700);

    &::before {
      content: "•";
      ${tw`mr-2`}
      color: var(--colors-gray-400);
    }
  }
`;

const FooterLink = styled(Link)`
  ${tw`flex items-center gap-2 text-gray-600`}

  &:hover {
    ${tw`text-gray-900`}
  }
`;

export const Background = () => (
  <div tw="opacity-50 md:opacity-100 absolute inset-0 pointer-events-none"></div>
);
