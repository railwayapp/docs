import type { CodegenConfig } from "@graphql-codegen/cli";
import { COMMUNITY_API_URL } from "@/config";

const PATH = "src/graphql/community";
const GQL_DOCUMENTS_PATH = PATH + "/*.graphql";
const GENERATED_SDK_PATH = PATH + "/sdk.ts";

const codegen: CodegenConfig = {
  schema: COMMUNITY_API_URL,
  overwrite: true,
  documents: [GQL_DOCUMENTS_PATH],
  generates: {
    [GENERATED_SDK_PATH]: {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        rawRequest: true,
      },
    },
  },
};

export default codegen;