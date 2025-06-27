import React, { useEffect, useState, useRef } from "react";
import tw, { TwStyle } from "twin.macro";
import { Link } from "./Link";
import { scrollToID } from "@/utils/scroll";

export interface Props {
  title: string;
}

interface IHeader {
  level: number;
  title: string;
  id: string;
  subHeaders: IHeader[];
}

const nodeNameToLevel: Record<string, number> = { H1: 1, H2: 2, H3: 3, H4: 4 };

const nodeToHeader = (node: HTMLHeadingElement): IHeader => ({
  level: nodeNameToLevel[node.nodeName],
  title: node.innerText,
  id: node.id,
  subHeaders: [],
});

const buildHeaderTreeRec = (
  nodes: HTMLHeadingElement[],
  elm: IHeader,
  level: number,
): IHeader[] => {
  const headers: IHeader[] = [];
  while (nodes.length > 0) {
    const h = nodeToHeader(nodes[0]);

    if (h.level === level) {
      headers.push(h);
      nodes.shift();
      elm = h;
    } else if (h.level > level) {
      elm.subHeaders = buildHeaderTreeRec(nodes, elm, h.level);
    } else {
      break;
    }
  }

  return headers;
};

const buildHeaderTree = (nodes: HTMLHeadingElement[]): IHeader[] => {
  if (nodes.length === 0) {
    return [];
  }

  const n = nodes[0];
  const h = nodeToHeader(n);

  return buildHeaderTreeRec(nodes, h, h.level);
};

export const PageNav: React.FC<Props> = ({ title }) => {
  const [headers, setHeaders] = useState<IHeader[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [flatIds, setFlatIds] = useState<string[]>([]);
  const linkRefs = useRef<{ [id: string]: HTMLAnchorElement | null }>({});

  useEffect(() => {
    const documentHeaders = Array.from(
      document.querySelectorAll(".docs-content h2, h3, h4"),
    ) as HTMLHeadingElement[];
    setHeaders(buildHeaderTree(documentHeaders));
    setFlatIds(documentHeaders.map(h => h.id));
  }, [title]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = Array.from(
        document.querySelectorAll(".docs-content h2, h3, h4")
      ) as HTMLHeadingElement[];
      const scrollPosition = window.scrollY + 100;
      let currentId = headings.length > 0 ? headings[0].id : "";
      for (const heading of headings) {
        if (heading.offsetTop <= scrollPosition) {
          currentId = heading.id;
        } else {
          break;
        }
      }
      setActiveId(currentId);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [title]);

  useEffect(() => {
    if (activeId && linkRefs.current[activeId]) {
      linkRefs.current[activeId]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <div tw="flex-col w-[300px] pt-4 pl-12 xl:pl-16 pr-0 pb-6 min-w-pageNav hidden lg:flex">
      {headers.length !== 0 && (
        <aside tw="sticky top-12 h-[100vh] relative">
          <div tw="overflow-y-auto h-full">
            <h5 tw="text-sm text-gray-900 font-medium mb-3">On This Page</h5>
            <ul tw="space-y-3">
              <HeaderList headers={headers} nesting={0} activeId={activeId} linkRefs={linkRefs.current} />
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
};

const nestingTw: Record<number, TwStyle> = {
  0: tw`ml-0`,
  1: tw`ml-6`,
  2: tw`ml-10`,
};

const HeaderList: React.FC<{ headers: IHeader[]; nesting: number; activeId?: string; linkRefs?: { [id: string]: HTMLAnchorElement | null } }> = ({
  headers,
  nesting,
  activeId = "",
  linkRefs = {},
}) => {
  return (
    <>
      {headers.map((h, i) => {
        const isActive = h.id === activeId;
        return (
          <React.Fragment key={`${h.id}-${i}`}>
            <li key={h.id} css={[nestingTw[nesting]]}>
              <Link
                ref={el => { linkRefs[h.id] = el; }}
                css={[
                  tw`inline-block text-gray-600 text-sm`,
                  tw`hover:text-pink-500`,
                  isActive && tw`font-medium text-pink-500`,
                ]}
                href={`#${h.id}`}
                onClick={scrollToID(h.id)}
              >
                {h.title}
              </Link>
            </li>
            {h.subHeaders.length > 0 && (
              <HeaderList headers={h.subHeaders} nesting={nesting + 1} activeId={activeId} linkRefs={linkRefs} />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
