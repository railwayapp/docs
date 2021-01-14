import "twin.macro";
import { PageNav } from "../components/PageNav";
import { FrontMatter } from "../types";
import { Page, Props as PageProps } from "./Page";

export interface Props extends PageProps {
  frontMatter: FrontMatter;
}

export const DocsLayout: React.FC<Props> = ({
  frontMatter,
  children,
  ...props
}) => {
  return (
    <Page {...props} seo={{ title: `${frontMatter.title} - Railway` }}>
      <div tw="max-w-prose flex-auto prose">
        <h1>{frontMatter.title}</h1>

        <div className="docs-content">{children}</div>
      </div>

      <PageNav title={frontMatter.title} />
    </Page>
  );
};
