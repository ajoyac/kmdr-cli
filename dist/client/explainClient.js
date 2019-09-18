"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("../graphql");
const client_1 = require("./client");
class ExplainClient extends client_1.Client {
    constructor(version) {
        super(version);
    }
    async getExplanation(query, schema) {
        const transformResponse = (res) => {
            if (res) {
                try {
                    const obj = JSON.parse(res);
                    return obj.data;
                }
                catch (err) {
                    throw err;
                }
            }
        };
        return super.doQuery(graphql_1.queryExplain, { query }, { transformResponse });
    }
    async sendFeedback(answer, comment) {
        return super.doMutation(graphql_1.mutationCreateExplainFeedback, { answer, comment });
    }
}
exports.ExplainClient = ExplainClient;
//# sourceMappingURL=explainClient.js.map