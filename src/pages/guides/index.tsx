import { NextPage, GetStaticProps } from "next";
import { useState, useMemo } from "react";
import { Link } from "../../components/link";
import { SEO } from "../../components/seo";
import { Icon } from "../../components/icon";
import { Footer } from "../../components/footer";
import { allGuides, Guide } from "content-collections";

// Shared topic IDs — use these everywhere instead of raw strings
const TOPIC_IDS = {
  FRAMEWORKS: "frameworks",
  INFRASTRUCTURE: "infrastructure",
  CICD: "cicd",
  TROUBLESHOOTING: "troubleshooting",
} as const;

type TopicId = (typeof TOPIC_IDS)[keyof typeof TOPIC_IDS];

// Topic definitions with display config
const TOPICS: {
  name: string;
  id: TopicId;
  description: string;
  gradientLight: string;
  gradientDark: string;
  featured: string[]; // slugs of 3 highlighted guides per section
}[] = [
  {
    name: "Frameworks & Integrations",
    id: TOPIC_IDS.FRAMEWORKS,
    description: "Deploy your favorite tools",
    gradientLight:
      "from-[#EFD580]/25 to-white hover:from-[#EFD580]/40 hover:to-white",
    gradientDark:
      "dark:from-[#675518]/25 dark:to-[#131415] dark:hover:from-[#675518]/40 dark:hover:to-[#131415]",
    featured: ["nextjs", "django", "rails"],
  },
  {
    name: "Infrastructure",
    id: TOPIC_IDS.INFRASTRUCTURE,
    description: "Security, observability, and more",
    gradientLight:
      "from-[#8CAEF2]/25 to-white hover:from-[#8CAEF2]/40 hover:to-white",
    gradientDark:
      "dark:from-[#1D4596]/25 dark:to-[#131415] dark:hover:from-[#1D4596]/40 dark:hover:to-[#131415]",
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
    gradientLight:
      "from-[#F1C1C0]/25 to-white hover:from-[#F1C1C0]/40 hover:to-white",
    gradientDark:
      "dark:from-[#741D1B]/25 dark:to-[#131415] dark:hover:from-[#741D1B]/40 dark:hover:to-[#131415]",
    featured: [
      "github-actions-post-deploy",
      "github-actions-pr-environment",
      "github-actions-runners",
    ],
  },
  {
    name: "Troubleshooting",
    id: TOPIC_IDS.TROUBLESHOOTING,
    description: "Diagnose and fix common issues",
    gradientLight:
      "from-[#95D0B4]/25 to-white hover:from-[#95D0B4]/40 hover:to-white",
    gradientDark:
      "dark:from-[#26543F]/25 dark:to-[#131415] dark:hover:from-[#26543F]/40 dark:hover:to-[#131415]",
    featured: ["troubleshooting-slow-deployments", "troubleshooting-slow-apps"],
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = useMemo(() => {
    if (!searchQuery) return guides;
    const query = searchQuery.toLowerCase();
    return guides.filter(
      guide =>
        guide.title.toLowerCase().includes(query) ||
        guide.description.toLowerCase().includes(query) ||
        guide.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
    );
  }, [guides, searchQuery]);

  // Group guides by topic from frontmatter
  const groupedGuides = useMemo(() => {
    const topicIds = new Set<string>(TOPICS.map(t => t.id));
    const groups: Record<string, Guide[]> = {};
    for (const topic of TOPICS) {
      groups[topic.id] = [];
    }
    groups["misc"] = [];

    for (const guide of filteredGuides) {
      const topic = guide.topic;
      if (topic && topicIds.has(topic)) {
        groups[topic].push(guide);
      } else {
        groups["misc"].push(guide);
      }
    }

    // Sort guides within each group alphabetically by title
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.title.localeCompare(b.title));
    }

    return groups;
  }, [filteredGuides]);

  const isSearching = searchQuery.length > 0;

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

        {/* Search */}
        <div className="mb-8">
          <div className="relative w-full sm:w-64">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-base pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search guides"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-muted bg-muted-app text-foreground placeholder:text-muted-base focus:outline-none focus:ring-2 focus:ring-primary-solid focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {isSearching ? (
          <>
            {filteredGuides.length > 0 ? (
              <div className="flex flex-col">
                {filteredGuides
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((guide, index) => (
                    <div key={guide.url}>
                      {index > 0 && <hr className="border-muted" />}
                      <Link
                        href={guide.url}
                        className="group flex items-center justify-between gap-4 py-4 hover:bg-muted-element/50 -mx-3 px-3 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
                      >
                        <h2 className="text-base font-medium text-muted-high-contrast group-hover:text-foreground transition-colors flex-1 min-w-0 truncate">
                          {guide.title}
                        </h2>
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
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-base">No guides found.</p>
                <p className="text-sm text-muted-base mt-2">
                  Try adjusting your search.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Featured Topic Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 mb-16">
              {TOPICS.map(topic => (
                <a
                  key={topic.id}
                  href={`#${topic.id}`}
                  className={`group relative h-32 md:h-40 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 bg-gradient-to-br ${topic.gradientLight} ${topic.gradientDark} shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-muted`}
                >
                  <div className="relative z-10 p-6">
                    <div
                      className="font-medium mb-1 text-foreground text-lg"
                      style={{ letterSpacing: "-0.25px" }}
                    >
                      {topic.name}
                    </div>
                    <div className="text-muted-base text-base font-normal max-w-[20rem] md:max-w-[16rem]">
                      {topic.description}
                    </div>
                  </div>
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

            {/* Misc — guides with no topic assigned */}
            {groupedGuides["misc"] && groupedGuides["misc"].length > 0 && (
              <TopicSection
                topic={{
                  name: "Misc",
                  id: "misc" as TopicId,
                  description: "Additional guides and resources",
                  gradientLight: "",
                  gradientDark: "",
                  featured: [],
                }}
                guides={groupedGuides["misc"]}
              />
            )}
          </>
        )}

        <Footer />
      </div>
    </>
  );
};

// Section component: 3 featured cards at top, then a list (scrollable after 15)
function TopicSection({
  topic,
  guides,
}: {
  topic: (typeof TOPICS)[number];
  guides: Guide[];
}) {
  const featuredSet = new Set(topic.featured);
  const featured = guides.filter(g => featuredSet.has(getGuideSlug(g)));
  const rest = guides.filter(g => !featuredSet.has(getGuideSlug(g)));
  const needsScroll = rest.length > VISIBLE_LIST_COUNT;

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
              <div className="text-muted-base text-sm mt-1 line-clamp-2">
                {guide.description}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Remaining guides as a list, scrollable after VISIBLE_LIST_COUNT */}
      {rest.length > 0 && (
        <div
          className={
            needsScroll
              ? "max-h-[540px] overflow-y-auto border border-muted rounded-lg"
              : ""
          }
        >
          <div className="flex flex-col">
            {rest.map((guide, index) => (
              <div key={guide.url}>
                {index > 0 && <hr className="border-muted" />}
                <Link
                  href={guide.url}
                  className="group flex items-center justify-between gap-4 py-3 hover:bg-muted-element/50 px-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
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
        </div>
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
