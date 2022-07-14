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
    signingSecret: IOTWShared.Methods.parseEnvVar(
      IOTWShared.Methods.reqMsg("signing secret"),
      "IOTW_SLACKBOT_SIGNING_SECRET_OKD",
      "IOTW_SLACKBOT_SIGNING_SECRET"
    ),
    appToken: IOTWShared.Methods.parseEnvVar(
      IOTWShared.Methods.reqMsg("app token"),
      "IOTW_SLACKBOT_APP_TOKEN_OKD",
      "IOTW_SLACKBOT_APP_TOKEN"
    ),
    token: IOTWShared.Methods.parseEnvVar(
      IOTWShared.Methods.reqMsg("token"),
      "IOTW_SLACKBOT_TOKEN_OKD",
      "IOTW_SLACKBOT_TOKEN"
    ),
    host: IOTWShared.Methods.parseEnvVar(
      IOTWShared.Methods.reqMsg("localhost"),
      "IOTW_SLACKBOT_HOST_OKD",
      "IOTW_SLACKBOT_HOST"
    ),
    port: IOTWShared.Methods.parseEnvVar(
      IOTWShared.Methods.reqMsg("3000"),
      "IOTW_SLACKBOT_PORT_OKD",
      "IOTW_SLACKBOT_PORT"
    ),
  },
  api: {
    host: IOTWShared.Methods.parseEnvVar(
      IOTWShared.Methods.reqMsg("localhost"),
      "IOTW_API_HOST_OKD",
      "IOTW_API_HOST"
    ),
    port: IOTWShared.Methods.parseEnvVar(
      IOTWShared.Methods.reqMsg("3001"),
      "IOTW_API_PORT_OKD",
      "IOTW_API_PORT"
    ),
  },
};

export default Config;
