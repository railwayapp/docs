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
};

export enum ExampleError {
  BadAccess = "BadAccess",
  Generic = "Generic",
  Internal = "Internal",
  NotFound = "NotFound",
  User = "User",
}

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

export type Post = {
  __typename?: "Post";
  body: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  deletedAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  thread: Thread;
  updatedAt: Scalars["DateTime"]["output"];
};

export type Query = {
  __typename?: "Query";
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  post?: Maybe<Post>;
  thread?: Maybe<Thread>;
  threads: QueryThreadsConnection;
};

export type QueryNodeArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryNodesArgs = {
  ids: Array<Scalars["ID"]["input"]>;
};

export type QueryPostArgs = {
  id: Scalars["String"]["input"];
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
  last?: InputMaybe<Scalars["Int"]["input"]>;
  mine?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  __typename?: "Thread";
  answeredByPost?: Maybe<Post>;
  body: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  deletedAt?: Maybe<Scalars["DateTime"]["output"]>;
  duplicateThreadSlug?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  isPrivate: Scalars["Boolean"]["output"];
  lastActivityAt?: Maybe<Scalars["DateTime"]["output"]>;
  pinned: Scalars["Boolean"]["output"];
  posts: Array<Post>;
  railwayTeamId?: Maybe<Scalars["String"]["output"]>;
  slug: Scalars["String"]["output"];
  subject: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
  upvoteCount: Scalars["Int"]["output"];
};

export type ThreadQueryVariables = Exact<{
  slug: Scalars["String"]["input"];
}>;

export type ThreadQuery = {
  __typename?: "Query";
  thread?: {
    __typename?: "Thread";
    upvoteCount: number;
    posts: Array<{
      __typename?: "Post";
      id: string;
      body: string;
      createdAt: any;
    }>;
  } | null;
};

export type ThreadFragment = {
  __typename?: "Thread";
  upvoteCount: number;
  posts: Array<{
    __typename?: "Post";
    id: string;
    body: string;
    createdAt: any;
  }>;
};

export const PostFieldsFragmentDoc = gql`
  fragment PostFields on Post {
    id
    body
    createdAt
  }
`;
export const ThreadFragmentDoc = gql`
  fragment Thread on Thread {
    upvoteCount
    posts {
      ...PostFields
    }
  }
  ${PostFieldsFragmentDoc}
`;
export const ThreadDocument = gql`
  query thread($slug: String!) {
    thread(slug: $slug) {
      ...Thread
    }
  }
  ${ThreadFragmentDoc}
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
