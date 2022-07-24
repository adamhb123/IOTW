// Initialize configuration
import EasyConfig from "easyconfig-ts";
import IOTWShared from "iotw-shared";

if (process.env["IOTW_SUBLEVEL_CONFIGURATIONS"] !== "false") {
  EasyConfig({
    rootPath: __dirname,
    dotFiles: ["../.env", "../.env.local", "../.env.template"],
  });
}



export const Config = {
  slackbot: {
    signingSecret: IOTWShared.parseEnvVar(
      IOTWShared.reqMsg("signing secret"),
      "IOTW_SLACKBOT_SIGNING_SECRET_OKD",
      "IOTW_SLACKBOT_SIGNING_SECRET"
    ),
    appToken: IOTWShared.parseEnvVar(
      IOTWShared.reqMsg("app token"),
      "IOTW_SLACKBOT_APP_TOKEN_OKD",
      "IOTW_SLACKBOT_APP_TOKEN"
    ),
    token: IOTWShared.parseEnvVar(
      IOTWShared.reqMsg("token"),
      "IOTW_SLACKBOT_TOKEN_OKD",
      "IOTW_SLACKBOT_TOKEN"
    ),
    host: IOTWShared.parseEnvVar(
      IOTWShared.reqMsg("localhost"),
      "IOTW_SLACKBOT_HOST_OKD",
      "IOTW_SLACKBOT_HOST"
    ),
    port: IOTWShared.parseEnvVar(
      IOTWShared.reqMsg("3000"),
      "IOTW_SLACKBOT_PORT_OKD",
      "IOTW_SLACKBOT_PORT"
    ),
  },
  api: {
    host: IOTWShared.parseEnvVar(
      IOTWShared.reqMsg("localhost"),
      "IOTW_API_HOST_OKD",
      "IOTW_API_HOST"
    ),
    port: IOTWShared.parseEnvVar(
      IOTWShared.reqMsg("3001"),
      "IOTW_API_PORT_OKD",
      "IOTW_API_PORT"
    ),
  },
};

export default Config;
