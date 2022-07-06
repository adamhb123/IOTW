// Initialize configuration
import EasyConfig from "easyconfig-ts";
EasyConfig({
  rootPath: __dirname,
  dotFiles: ["../.env", "../.env.local", "../.env.template"],
});
// Definition of "primitive" is loose here
type _PrimitiveTypeString =
  | "boolean"
  | "number"
  | "bigint"
  | "string"
  | "symbol"
  | "object";

const _stringToPrimitive = (
  string: string,
  desiredPrimitive: _PrimitiveTypeString
) => {
  return {
    boolean: () => (string === "true" ? true : false),
    number: () => Number(string),
    bigint: () => BigInt(string),
    string: () => string,
    symbol: () => Symbol(string),
    object: () => JSON.parse(string),
  }[desiredPrimitive]();
};

const _parseEnvVar = (
  failureDefault: any,
  ...possibleEnvVarNames: string[]
) => {
  const desiredPrimitive = <_PrimitiveTypeString>typeof failureDefault;
  for (const envVarName of possibleEnvVarNames) {
    const envVar = process.env[envVarName];
    if (typeof envVar !== "undefined") {
      console.log(envVar);
      return _stringToPrimitive(envVar, desiredPrimitive);
    }
  }
  return failureDefault;
};

const _reqMsg = (varName: string) =>
  `${varName} required, please configure your environment variables`;

export const Config = {
  slackbot: {
    signingSecret: _parseEnvVar(
      _reqMsg("signing secret"),
      "IOTW_SLACKBOT_SIGNING_SECRET_OKD",
      "IOTW_SLACKBOT_SIGNING_SECRET"
    ),
    appToken: _parseEnvVar(
      _reqMsg("app token"),
      "IOTW_SLACKBOT_APP_TOKEN_OKD",
      "IOTW_SLACKBOT_APP_TOKEN"
    ),
    token: _parseEnvVar(
      _reqMsg("token"),
      "IOTW_SLACKBOT_TOKEN_OKD",
      "IOTW_SLACKBOT_TOKEN"
    ),
    host: _parseEnvVar(
      "localhost",
      "IOTW_SLACKBOT_HOST_OKD",
      "IOTW_SLACKBOT_HOST"
    ),
    port: _parseEnvVar("3000", "IOTW_SLACKBOT_PORT_OKD", "IOTW_SLACKBOT_PORT"),
  },
  api: {
    host: _parseEnvVar("localhost", "IOTW_API_HOST_OKD", "IOTW_API_HOST"),
    port: _parseEnvVar("3001", "IOTW_API_PORT_OKD", "IOTW_API_PORT"),
  },
};

export default Config;
