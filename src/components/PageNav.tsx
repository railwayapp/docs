import tw from "twin.macro";
import React, { useEffect, useState } from "react";
import { Link } from "./Link";

export interface Props {
  title: string;
}

interface IHeader {
  level: number;
  title: string;
  id: string;
  subHeaders: IHeader[];
}

const nodeNameToLevel = { H1: 1, H2: 2, H3: 3, H4: 4 };

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

  useEffect(() => {
    const documentHeaders = Array.from(
      document.querySelectorAll(".docs-content h1, h2, h3, h4"),
    ) as HTMLHeadingElement[];

    setHeaders(buildHeaderTree(documentHeaders));
  }, [title]);

  if (headers.length === 0) {
    return null;
  }

  return (
    <div tw="flex-col pt-8 pl-12 pr-8 pb-6 min-w-pageNav hidden lg:flex">
      <aside tw="sticky top-24">
        <h5 tw="text-sm text-gray-900 font-medium mb-3">On This Page</h5>
        <ul tw="space-y-3">
          <HeaderList headers={headers} nesting={0} />
        </ul>
      </aside>
    </div>
  );
};

const nestingTw = {
  0: tw`ml-0`,
  1: tw`ml-6`,
  2: tw`ml-10`,
};

const HeaderList: React.FC<{ headers: IHeader[]; nesting: number }> = ({
  headers,
  nesting,
}) => (
  <>
    {headers.map((h, i) => (
      <React.Fragment key={`${h.id}-${i}`}>
        <li key={h.id} css={[nestingTw[nesting]]}>
          <Link
            css={[tw`inline-block text-gray-600 text-sm`, tw`hover:underline`]}
            href={`#${h.id}`}
          >
            {h.title}
          </Link>
        </li>

        {h.subHeaders.length > 0 && (
          <HeaderList headers={h.subHeaders} nesting={nesting + 1} />
        )}
      </React.Fragment>
    ))}
  </>
);
