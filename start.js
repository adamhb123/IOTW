/*#!/usr/bin/env bash
export $(((cat .env ; echo "IOTW_SUBLEVEL_CONFIGURATIONS=false") | grep -v "#") | xargs) &&
cd IOTW-slackbot && npm start &
cd IOTW-api && npm start &
cd IOTW-webapp && npm start &*/

const { exec } = require("child_process");
const { EasyConfig } = require("easyconfig-ts");

EasyConfig({
    rootPath: __dirname,
    dotFiles: ["./.env", "./.env.template"],
});
const startCommand = `cd IOTW-slackbot && npm start & \
cd IOTW-api && npm start & \
cd IOTW-webapp && npm start &`;

exec(startCommand, (err, stdout, stderr) => {
  if (err) {
    console.error("IOTW launch failed");
    return;
  }
  // the *entire* stdout and stderr (buffered)d
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});