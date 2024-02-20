import dotenv from "dotenv";
dotenv.config();

export const COMMUNITY_WEB_BASE_URL = process.env.NEXT_PUBLIC_COMMUNITY_WEB_BASE_URL;
export const COMMUNITY_API_BASE_URL = process.env.NEXT_PUBLIC_COMMUNITY_API_BASE_URL;
export const COMMUNITY_API_URL = COMMUNITY_API_BASE_URL + '/gql';
export const COMMUNITY_TOPIC = process.env.NEXT_PUBLIC_COMMUNITY_TOPIC || 'feedback';
export const RAILWAY_DOCS_URL = process.env.NEXT_PUBLIC_RAILWAY_DOCS_URL;