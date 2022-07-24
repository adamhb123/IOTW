const { spawn } = require("child_process");
const { EasyConfig } = require("easyconfig-ts");
const fs = require("fs");

EasyConfig({
  rootPath: __dirname,
  dotFiles: ["./.env", "./.env.template"],
});

const ConsoleColors = {
  Foreground: {
    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m",
  },
  Background: {
    Black: "\x1b[40m",
    Red: "\x1b[41m",
    Green: "\x1b[42m",
    Yellow: "\x1b[43m",
    Blue: "\x1b[44m",
    Magenta: "\x1b[45m",
    Cyan: "\x1b[46m",
    White: "\x1b[47m",
  },
};

const STDType = {
  EXIT: 0,
  STDOUT: 1,
  STDERR: 2,
};

function STDQueueElement(processDescriptorName, stdType, data) {
  this.processDescriptorName = processDescriptorName;
  this.stdType = stdType;
  this.data = data;
}

function ProcessDescriptor(name, command, textColor = null) {
  this.name = name;
  this.command = command;
  this.textColor = textColor;
}

const processDescriptors = [
  new ProcessDescriptor(
    "Slackbot",
    "cd IOTW-slackbot && npm start",
    ConsoleColors.Foreground.Blue
  ),
  new ProcessDescriptor(
    "API",
    "cd IOTW-api && npm start",
    ConsoleColors.Foreground.Magenta
  ),
  new ProcessDescriptor(
    "Webapp",
    "cd IOTW-webapp && npm start",
    ConsoleColors.Foreground.Green
  ),
];

let STDQueue = [];
for (const processDescriptor of processDescriptors) {
  const process = spawn(processDescriptor.command, {
    detached: true,
    shell: true,
  });
  const outputPrefix = `${processDescriptor.textColor}[${processDescriptor.name}]`;
  process.stdout.on("data", (data) => {
    STDQueue.push(
      new STDQueueElement(
        processDescriptor.name,
        STDType.STDOUT,
        `${outputPrefix} ${data}`
      )
    );
  });
  process.stderr.on("data", (data) => {
    STDQueue.push(
      new STDQueueElement(
        processDescriptor.name,
        STDType.STDERR,
        `${outputPrefix}${ConsoleColors.Foreground.Red} STDERR: ${data}`
      )
    );
  });
  process.on("exit", (exitCode) => {
    STDQueue.push(
      new STDQueueElement(
        processDescriptor.name,
        STDType.EXIT,
        `${outputPrefix} exited with code: ${exitCode}`
      )
    );
  });
  process.unref();
}

let exitCount = 0;
setInterval(() => {
  STDQueue = STDQueue.sort((a, b) =>
    a.processDescriptorName > b.processDescriptorName ? 1 : -1
  );
  let stdItem;
  while ((stdItem = STDQueue.pop())) {
    switch (stdItem.stdType) {
      case STDType.STDOUT:
        console.log(stdItem.data);
        break;
      case STDType.EXIT:
        exitCount++;
      default:
        console.error(stdItem.data);
    }
  }
}, 1000);
