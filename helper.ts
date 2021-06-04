import {
  Handler as NetlifyHandler,
  HandlerContext,
  HandlerCallback,
  HandlerResponse,
  HandlerEvent,
} from "@netlify/functions";

export { gql } from "@urql/core";
import { Client, createClient } from "@urql/core";
import "isomorphic-unfetch";

export interface Context extends HandlerContext {
  graph?: Client;
}

export interface Handler {
  (event: HandlerEvent, context: Context, callback: HandlerCallback):
    | void
    | HandlerResponse
    | Promise<HandlerResponse>;
}

const ENDPOINT =
  "https://serve.onegraph.com/graphql?app_id=b6a66044-13f0-4049-8d13-6d906de655d8";

export function withGraph(handler: Handler): NetlifyHandler {
  if (!process.env.ONEGRAPH_TOKEN) {
    return handler;
  }

  const graph = createClient({
    url: ENDPOINT,
    fetchOptions: () => {
      return {
        headers: { authorization: `Bearer ${process.env.ONEGRAPH_TOKEN}` },
      };
    },
  });
  return (event, context, callback) =>
    handler(event, { ...context, graph }, callback);
}
