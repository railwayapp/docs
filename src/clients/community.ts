import { COMMUNITY_API_URL } from "@/config";
import { getSdk } from "../graphql/community/sdk";
import { GraphQLClient } from "graphql-request";

export const communityClient = getSdk(new GraphQLClient(COMMUNITY_API_URL));