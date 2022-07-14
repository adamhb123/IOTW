import IOTWShared from "iotw-shared";
import EasyConfig from "easyconfig-ts";
console.log("amongussex: " + process.env["IOTW_SUBLEVEL_CONFIGURATIONS"]);
if (process.env["IOTW_SUBLEVEL_CONFIGURATIONS"] !== "false") {
  EasyConfig({
    rootPath: __dirname,
    dotFiles: ["../.env", "../.env.local", "../.env.template"],
  });
}
const Config = {
  mysql: {
    host: IOTWShared.parseEnvVar("localhost", "IOTW_MYSQL_HOST_OKD", "IOTW_MYSQL_HOST"),
    port: IOTWShared.parseEnvVar("3306", "IOTW_MYSQL_PORT_OKD", "IOTW_MYSQL_PORT"),
    user: IOTWShared.parseEnvVar("root", "IOTW_MYSQL_USER_OKD", "IOTW_MYSQL_USER"),
    password: IOTWShared.parseEnvVar("", "IOTW_MYSQL_PASSWORD_OKD", "IOTW_MYSQL_PASSWORD"),
    databaseName: IOTWShared.parseEnvVar(
      "iotw",
      "IOTW_MYSQL_DATABASE_NAME_OKD",
      "IOTW_MYSQL_DATABASE_NAME"
    ),
  },
  api: {
    host: IOTWShared.parseEnvVar("localhost", "IOTW_API_HOST_OKD", "IOTW_API_HOST"),
    port: IOTWShared.parseEnvVar("3001", "IOTW_API_PORT_OKD", "IOTW_API_PORT"),
    storeSubmissionsLocally: IOTWShared.parseEnvVar(
      true,
      "IOTW_API_STORE_SUBMISSIONS_LOCALLY_OKD",
      "IOTW_API_STORE_SUBMISSIONS_LOCALLY"
    ),
  },
  slackbot: {
    token: IOTWShared.parseEnvVar(
      "need-token",
      "IOTW_SLACKBOT_TOKEN_OKD",
      "IOTW_SLACKBOT_TOKEN"
    ),
  },
};

export default Config;
