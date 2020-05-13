import { Client } from "@elastic/elasticsearch";

export const ESClient = new Client({
  node: process.env.ES_URL
});