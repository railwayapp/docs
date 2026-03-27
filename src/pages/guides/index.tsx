import { NextPage, GetStaticProps } from "next";
import { useState, useMemo } from "react";
import { Link } from "../../components/link";
import { SEO } from "../../components/seo";
import { Footer } from "../../components/footer";
import { allGuides, Guide } from "content-collections";

// Shared topic IDs — use these everywhere instead of raw strings
const TOPIC_IDS = {
  FRAMEWORKS: "frameworks",
  INFRASTRUCTURE: "infrastructure",
  CICD: "cicd",
} as const;

type TopicId = (typeof TOPIC_IDS)[keyof typeof TOPIC_IDS];

// Topic definitions with display config
const TOPICS: {
  name: string;
  id: TopicId;
  description: string;
  featured: string[]; // slugs of 3 highlighted guides per section
}[] = [
  {
    name: "Frameworks & Integrations",
    id: TOPIC_IDS.FRAMEWORKS,
    description: "Deploy your favorite tools",
    featured: ["nextjs", "django", "rails"],
  },
  {
    name: "Infrastructure",
    id: TOPIC_IDS.INFRASTRUCTURE,
    description: "Security, observability, and more",
    featured: [
      "deploying-a-monorepo",
      "deploy-an-otel-collector-stack",
      "static-hosting",
    ],
  },
  {
    name: "CI/CD",
    id: TOPIC_IDS.CICD,
    description: "Automate deployments and rollouts",
    featured: [
      "github-actions-post-deploy",
      "github-actions-pr-environment",
      "github-actions-runners",
    ],
  },
];

const VISIBLE_LIST_COUNT = 15;

function getGuideSlug(guide: Guide): string {
  return guide._raw.flattenedPath;
}

interface GuidesPageProps {
  guides: Guide[];
}

const GuidesPage: NextPage<GuidesPageProps> = ({ guides }) => {
  // Group guides by topic from frontmatter
  const groupedGuides = useMemo(() => {
    const groups: Record<string, Guide[]> = {};
    for (const topic of TOPICS) {
      groups[topic.id] = [];
    }

    for (const guide of guides) {
      const topic = guide.topic;
      if (groups[topic]) {
        groups[topic].push(guide);
      }
    }

    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.title.localeCompare(b.title));
    }

    return groups;
  }, [guides]);

  return (
    <>
      <SEO
        title="Guides | Railway"
        description="In-depth guides, tutorials, and how-tos for deploying on Railway"
        url="https://docs.railway.com/guides"
      />
      <div className="w-full z-10">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl mb-4 text-foreground font-serif font-medium"
            style={{
              lineHeight: 1.13,
              letterSpacing: "-0.035em",
              fontSize: "2.5rem",
            }}
          >
            Guides
          </h1>
          <p className="text-lg text-muted-base">
            In-depth guides, tutorials, and how-tos for deploying on Railway
          </p>
        </div>

        {/* Topic Badges */}
        <div className="flex flex-wrap gap-2 mb-12">
          {TOPICS.map(topic => (
            <a
              key={topic.id}
              href={`#${topic.id}`}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-muted-element text-muted-high-contrast hover:bg-muted-element-hover transition-colors"
            >
              {topic.name}
            </a>
          ))}
        </div>

        {/* Topic Sections */}
        {TOPICS.map(topic => {
          const topicGuides = groupedGuides[topic.id];
          if (!topicGuides || topicGuides.length === 0) return null;

          return (
            <TopicSection
              key={topic.id}
              topic={topic}
              guides={topicGuides}
            />
          );
        })}

        <Footer />
      </div>
    </>
  );
};

// Section component: 3 featured cards at top, then a list with "See more" expand
function TopicSection({
  topic,
  guides,
}: {
  topic: (typeof TOPICS)[number];
  guides: Guide[];
}) {
  const [expanded, setExpanded] = useState(false);
  const featuredSet = new Set(topic.featured);
  const featured = guides.filter(g => featuredSet.has(getGuideSlug(g)));
  const rest = guides.filter(g => !featuredSet.has(getGuideSlug(g)));
  const hasMore = rest.length > VISIBLE_LIST_COUNT;
  const displayedRest = expanded ? rest : rest.slice(0, VISIBLE_LIST_COUNT);

  return (
    <div id={topic.id} className="mb-16 scroll-mt-20">
      <h2
        className="text-2xl font-semibold mb-2 text-foreground"
        style={{ letterSpacing: "-0.5px" }}
      >
        {topic.name}
      </h2>
      <p className="text-muted-base text-base mb-6">{topic.description}</p>

      {/* Featured guides as cards */}
      {featured.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {featured.map(guide => (
            <Link
              key={guide.url}
              href={guide.url}
              className="group flex flex-col border rounded-lg p-5 transition-all duration-200 border-muted bg-muted-element/50 hover:bg-muted-element dark:bg-muted-element/20 dark:hover:bg-muted-element/50"
            >
              <div className="font-medium text-sm text-foreground group-hover:text-foreground transition-colors">
                {guide.title}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Remaining guides as a list */}
      {rest.length > 0 && (
        <>
          <div className="flex flex-col">
            {displayedRest.map((guide, index) => (
              <div key={guide.url}>
                {index > 0 && <hr className="border-muted" />}
                <Link
                  href={guide.url}
                  className="group flex items-center justify-between gap-4 py-3 hover:bg-muted-element/50 -mx-3 px-3 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
                >
                  <span className="text-sm font-medium text-muted-high-contrast group-hover:text-foreground transition-colors flex-1 min-w-0 truncate">
                    {guide.title}
                  </span>
                  {guide.tags && guide.tags.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      {guide.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-medium rounded-md bg-muted-element text-muted-base"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* See more / See less */}
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-sm font-medium text-primary-base hover:text-primary-high-contrast transition-colors flex items-center gap-1"
            >
              {expanded
                ? "See less"
                : `See ${rest.length - VISIBLE_LIST_COUNT} more`}
              <span
                className={`text-base transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              >
                ↓
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default GuidesPage;

export const getStaticProps: GetStaticProps<GuidesPageProps> = async () => {
  return {
    props: {
      guides: allGuides,
    },
  };
};
