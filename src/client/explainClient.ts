import { mutationCreateExplainFeedback, queryExplain } from "../graphql";
import { GraphQLResponse } from "../interfaces";
import { Client } from "./client";

export class ExplainClient extends Client {
  constructor(version: string) {
    super(version);
  }

  public async getExplanation(query: string, schema?: string) {
    const transformResponse = (res: string) => {
      if (res) {
        try {
          const obj = JSON.parse(res) as GraphQLResponse;
          return obj.data;
        } catch (err) {
          throw err;
        }
      }
    };

    return super.doQuery(queryExplain, { query }, { transformResponse });
  }

  public async sendFeedback(answer: string, comment: string) {
    return super.doMutation(mutationCreateExplainFeedback, { answer, comment });
  }
}
