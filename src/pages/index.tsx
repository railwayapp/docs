import { NextPage } from "next";
import { Icon } from "../components/Icon";
import { Link } from "../components/Link";

const Home: NextPage = () => {
  return (
    <>
      <div className="max-w-3xl mx-auto z-10">
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
          <p className="text-lg text-muted-base mb-6">
            Railway is all-in-one intelligent cloud provider that makes it easy
            to provision infrastructure, develop locally, and deploy to the
            cloud.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="https://railway.com"
              className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-white bg-primary-solid hover:bg-primary-solid-hover active:bg-primary-solid-active transition-colors"
            >
              Sign Up for Railway
            </Link>
            <Link
              href="/quick-start"
              className="inline-flex items-center px-4 py-2 rounded-lg font-medium border border-muted bg-muted-app text-muted-high-contrast hover:bg-muted-element hover:border-muted-hover transition-colors"
            >
              Quick Start Guide
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <ul className="space-y-4">
          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/reference/ai">AI</A>: Build with Railway using{" "}
            <A href="/reference/ai/agent-skills">Agent Skills</A> and the{" "}
            <A href="/reference/ai/mcp-server">MCP server</A>.
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/guides/cli">CLI</A>: Develop locally and deploy from your
            terminal
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/guides/templates">Templates</A>: One-click deployable
            applications and starters
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/reference/deployments">Deployments</A>: Deploy via{" "}
            <A href="/guides/github-autodeploys">GitHub</A>,{" "}
            <A href="/guides/cli">CLI</A>, or{" "}
            <A href="/guides/dockerfiles">Dockerfile</A>. Configure{" "}
            <A href="/guides/healthchecks">healthchecks</A>,{" "}
            <A href="/reference/scaling">scaling</A>, and{" "}
            <A href="/reference/regions">regions</A>
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/guides/services">Services</A>: The building blocks of your
            project. Attach <A href="/guides/volumes">volumes</A> for persistent
            storage or run them as <A href="/guides/cron-jobs">cron jobs</A>
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/guides/databases">Databases</A>: Managed{" "}
            <A href="/guides/postgresql">PostgreSQL</A>,{" "}
            <A href="/guides/mysql">MySQL</A>, <A href="/guides/redis">Redis</A>
            , and <A href="/guides/mongodb">MongoDB</A> with automatic{" "}
            <A href="/reference/backups">backups</A>
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/guides/storage-buckets">Storage Buckets</A>: S3-compatible
            object storage for files and assets
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/guides/public-networking">Networking</A>: Expose services
            with <A href="/reference/public-domains">custom domains</A>, connect
            services via{" "}
            <A href="/guides/private-networking">private networking</A>, and
            configure <A href="/reference/tcp-proxy">TCP proxy</A> for non-HTTP
            traffic
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/guides/observability">Observability</A>: Monitor your apps
            with <A href="/guides/logs">logs</A>,{" "}
            <A href="/guides/metrics">metrics</A>, and{" "}
            <A href="/guides/webhooks">webhooks</A>
          </li>
        </ul>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-muted">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              href="https://github.com/railwayapp/docs"
              className="flex items-center gap-2 text-muted-base hover:text-foreground transition-colors"
            >
              <Icon name="Github" className="size-4" />
              Contribute on GitHub
            </Link>
            <Link
              href="https://discord.gg/railway"
              className="flex items-center gap-2 text-muted-base hover:text-foreground transition-colors"
            >
              <Icon name="Discord" className="size-4" />
              Discord
            </Link>
            <Link
              href="https://x.com/Railway"
              className="flex items-center gap-2 text-muted-base hover:text-foreground transition-colors"
            >
              <Icon name="XIcon" className="size-4" />
              Twitter
            </Link>
            <Link
              href="https://youtube.com/@railwayapp"
              className="flex items-center gap-2 text-muted-base hover:text-foreground transition-colors"
            >
              <Icon name="Youtube" className="size-4" />
              YouTube
            </Link>
          </div>
        </div>
      </div>
      <Background />
    </>
  );
};

export default Home;

const A: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <Link href={href} className="text-primary-base font-medium hover:underline">
    {children}
  </Link>
);

export const Background = () => (
  <div className="opacity-50 md:opacity-100 absolute inset-0 pointer-events-none"></div>
);
