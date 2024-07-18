import { GraphQLClient } from "graphql-request";
import { GraphQLClientRequestHeaders } from "graphql-request/build/cjs/types";
import { print } from "graphql";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  JSON: { input: any; output: any };
};

export type Node = {
  id: Scalars["ID"]["output"];
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]["output"]>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor?: Maybe<Scalars["String"]["output"]>;
};

export type Query = {
  __typename?: "Query";
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  thread?: Maybe<Thread>;
  threads: QueryThreadsConnection;
};

export type QueryNodeArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryNodesArgs = {
  ids: Array<Scalars["ID"]["input"]>;
};

export type QueryTagsArgs = {
  names?: InputMaybe<Array<Scalars["String"]["input"]>>;
  topic?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryThreadArgs = {
  slug: Scalars["String"]["input"];
};

export type QueryThreadsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  followingOnly?: InputMaybe<Scalars["Boolean"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  mineOnly?: InputMaybe<Scalars["Boolean"]["input"]>;
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
  topic?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryTopicArgs = {
  slug: Scalars["String"]["input"];
};

export type QueryThreadsConnection = {
  __typename?: "QueryThreadsConnection";
  edges: Array<Maybe<QueryThreadsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryThreadsConnectionEdge = {
  __typename?: "QueryThreadsConnectionEdge";
  cursor: Scalars["String"]["output"];
  node: Thread;
};


export type Thread = Node & {
  /** The number of replies to this thread */
  replyCount: Scalars["Int"]["output"];
};

export type ThreadQueryVariables = Exact<{
  slug: Scalars["String"]["input"];
}>;

export type ThreadQuery = {
  __typename?: "Query";
  thread?: { __typename?: "Thread"; replyCount: number } | null;
};

export const ThreadDocument = gql`
  query thread($slug: String!) {
    thread(slug: $slug) {
      replyCount
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
) => action();
const ThreadDocumentString = print(ThreadDocument);
export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    thread(
      variables: ThreadQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<{
      data: ThreadQuery;
      extensions?: any;
      headers: Headers;
      status: number;
    }> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.rawRequest<ThreadQuery>(ThreadDocumentString, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "thread",
        "query",
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
