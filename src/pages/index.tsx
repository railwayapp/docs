import { NextPage } from "next";
import { Icon } from "../components/icon";
import { Link } from "../components/link";

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
            <A href="/ai">AI</A>: Build with Railway using{" "}
            <A href="/ai/agent-skills">Agent Skills</A> and the{" "}
            <A href="/ai/mcp-server">MCP server</A>.
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/cli">CLI</A>: Develop locally and deploy from your
            terminal
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/templates">Templates</A>: One-click deployable
            applications and starters
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/deployments">Deployments</A>: Deploy via{" "}
            <A href="/deployments/github-autodeploys">GitHub</A>,{" "}
            <A href="/cli">CLI</A>, or{" "}
            <A href="/builds/dockerfiles">Dockerfile</A>. Configure{" "}
            <A href="/deployments/scaling">scaling</A>, and{" "}
            <A href="/deployments/regions">regions</A>
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/services">Services</A>: The building blocks of your
            project. Attach <A href="/volumes">volumes</A> for persistent
            storage or run them as <A href="/cron-jobs">cron jobs</A>
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/databases">Databases</A>: Deploy{" "}
            <A href="/databases/postgresql">PostgreSQL</A>,{" "}
            <A href="/databases/mysql">MySQL</A>,{" "}
            <A href="/databases/redis">Redis</A>, and{" "}
            <A href="/databases/mongodb">MongoDB</A> with automatic{" "}
            <A href="/volumes/backups">backups</A>
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/storage-buckets">Storage Buckets</A>: S3-compatible object
            storage for files and assets
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/networking">Networking</A>: Expose services with{" "}
            <A href="/networking/domains">custom domains</A>, connect services
            via <A href="/networking/private-networking">private networking</A>,
            and configure <A href="/networking/tcp-proxy">TCP proxy</A> for
            non-HTTP traffic
          </li>

          <li className="text-base leading-relaxed text-muted-base before:content-['•'] before:mr-2 before:text-muted">
            <A href="/observability">Observability</A>: Monitor your apps with{" "}
            <A href="/observability/logs">logs</A>,{" "}
            <A href="/observability/metrics">metrics</A>, and{" "}
            <A href="/observability/webhooks">webhooks</A>
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
  <Link
    href={href}
    className="text-muted-high-contrast underline decoration-primary-base underline-offset-2 transition-colors hover:text-primary-base font-medium"
  >
    {children}
  </Link>
);

export const Background = () => (
  <div className="opacity-50 md:opacity-100 absolute inset-0 pointer-events-none"></div>
);
