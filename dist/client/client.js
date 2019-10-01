"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const os_1 = __importDefault(require("os"));
const tunnel_1 = __importDefault(require("tunnel"));
const url_1 = __importDefault(require("url"));
const v1_1 = __importDefault(require("uuid/v1"));
class Client {
    constructor(version, axiosInstance) {
        this.baseURL = process.env.KMDR_API_URL || "https://api.kmdr.sh/api/graphql";
        this.sessionId = v1_1.default();
        this.shell = process.env.SHELL || "";
        this.os = `${os_1.default.platform()} ${os_1.default.release()}`;
        this.term = `${process.env.TERM};${process.env.TERM_PROGRAM}`;
        this.version = version;
        this.isHttps = this.baseURL.startsWith("https:");
        const axiosConfig = {
            baseURL: this.baseURL,
            headers: {
                "Content-Type": "application/json",
                "X-kmdr-client-os": this.os,
                "X-kmdr-client-session-id": this.sessionId,
                "X-kmdr-client-shell": this.shell,
                "X-kmdr-client-term": this.term,
                "X-kmdr-client-version": this.version,
            },
            responseType: "json",
        };
        const proxyEnv = this.isHttps ? "https_proxy" : "http_proxy";
        let proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
        if (this.isHttps && proxyUrl) {
            proxyUrl = proxyUrl.startsWith("http") ? proxyUrl : "http://" + proxyUrl;
            const parsedProxyUrl = url_1.default.parse(proxyUrl);
            const proxy = {
                host: parsedProxyUrl.hostname || "",
                port: parseInt(parsedProxyUrl.port || "", 10),
                proxyAuth: parsedProxyUrl.auth,
            };
            let httpsAgent;
            httpsAgent = tunnel_1.default.httpsOverHttp({ proxy });
            axiosConfig.httpsAgent = httpsAgent;
            axiosConfig.proxy = false;
        }
        this.instance = axiosInstance || axios_1.default.create(axiosConfig);
    }
    doQuery(query, variables, config) {
        return this.post({ query, variables }, config);
    }
    doMutation(query, variables) {
        return this.post({ query, variables });
    }
    post(data, config) {
        return this.instance.post("", data, Object.assign({}, config));
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map