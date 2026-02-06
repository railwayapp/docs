import { NextPage, GetStaticProps } from "next";
import { useState, useMemo } from "react";
import { Link } from "../../components/link";
import { SEO } from "../../components/seo";
import { Icon } from "../../components/icon";
import { Footer } from "../../components/footer";
import { allGuides, Guide } from "content-collections";

interface GuidesPageProps {
  guides: Guide[];
}

const GuidesPage: NextPage<GuidesPageProps> = ({ guides }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter guides based on search query
  const filteredGuides = useMemo(() => {
    if (!searchQuery) return guides;

    const query = searchQuery.toLowerCase();
    return guides.filter(
      guide =>
        guide.title.toLowerCase().includes(query) ||
        guide.description.toLowerCase().includes(query) ||
        guide.tags?.some(tag => tag.toLowerCase().includes(query)),
    );
  }, [guides, searchQuery]);

  // Sort guides by date (newest first)
  const sortedGuides = useMemo(() => {
    return [...filteredGuides].sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredGuides]);

  return (
    <>
      <SEO
        title="Guides | Railway"
        description="In-depth guides and tutorials from the community"
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
            In-depth guides and tutorials from the community
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

        {/* Guides List */}
        {sortedGuides.length > 0 ? (
          <div className="flex flex-col">
            {sortedGuides.map((guide, index) => (
              <div key={guide.url}>
                {index > 0 && <hr className="border-muted" />}
                <Link
                  href={guide.url}
                  className="group flex items-center justify-between gap-4 py-4 hover:bg-muted-element/50 -mx-3 px-3 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid focus-visible:ring-offset-2 focus-visible:ring-offset-muted-app"
                >
                  {/* Title */}
                  <h2 className="text-base font-medium text-muted-high-contrast group-hover:text-foreground transition-colors flex-1 min-w-0 truncate">
                    {guide.title}
                  </h2>

                  {/* Tags */}
                  {guide.tags && guide.tags.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      {guide.tags.slice(0, 3).map(tag => (
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
            {searchQuery ? (
              <>
                <p className="text-muted-base">No guides found.</p>
                <p className="text-sm text-muted-base mt-2">
                  Try adjusting your search.
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-base">No guides available yet.</p>
                <p className="text-sm text-muted-base mt-2">
                  Check back soon for community guides and tutorials.
                </p>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default GuidesPage;

export const getStaticProps: GetStaticProps<GuidesPageProps> = async () => {
  return {
    props: {
      guides: allGuides,
    },
  };
};
