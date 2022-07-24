// External modules
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import fetch from "cross-fetch";
import fs from "fs";
import { pipeline } from "stream/promises";
import { randomUUID } from "crypto";
import { join } from "path";
// Local modules
import Config from "./config";
import IOTWRouter from "./routes";
import Logger from "easylogger-ts";

const pubdirLocal = join(__dirname, "../public");

export const MIMETypes: {
  [key: string]: string;
} = {
  bmp: "image/bmp",
  cod: "image/cis-cod",
  gif: "image/gif",
  ief: "image/ief",
  jpe: "image/jpeg",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  jfif: "image/pipeg",
  svg: "image/svg+xml",
  tif: "image/tiff",
  tiff: "image/tiff",
  ras: "image/x-cmu-raster",
  cmx: "image/x-cmx",
  ico: "image/x-icon",
  pnm: "image/x-portable-anymap",
  pbm: "image/x-portable-bitmap",
  pgm: "image/x-portable-graymap",
  ppm: "image/x-portable-pixmap",
  rgb: "image/x-rgb",
  xbm: "image/x-xbitmap",
  xpm: "image/x-xpixmap",
  xwd: "image/x-xwindowdump",
};

export const MIMETypeFromUrl = (url: string) => {
  const split = url.split("/");
  const filetypeSplit = split[split.length - 1].split(".");
  if (!filetypeSplit.length) return;
  const filetype = filetypeSplit[filetypeSplit.length - 1];
  if (!filetype) return;
  return MIMETypes[filetype];
};

type AnyRecord = Record<string, unknown> | Record<string, never>;

interface ResponsePacket {
  status: string;
  message: string | null;
  data: AnyRecord;
}
export const ResponsePacket = (
  status: string,
  message?: string | null,
  data?: AnyRecord
): ResponsePacket => ({
  status: status,
  message: message ?? "",
  data: data ?? {},
});

export interface SuccessResponsePacket extends ResponsePacket {
  status: "Success";
}
export const SuccessResponsePacket = (
  message?: string | null,
  data?: AnyRecord
): SuccessResponsePacket => ({
  status: "Success",
  message: message ?? "",
  data: data ?? {},
});

export interface ErrorResponsePacket extends ResponsePacket {
  status: "Error";
  code: number | null;
  message: string | null;
}
export const ErrorResponsePacket = (code?: number | null, message?: string | null, data?: AnyRecord): ErrorResponsePacket => ({
  status: "Error",
  code: code ?? null,
  message: message ?? "",
  data: data ?? {},
});

export const ConditionalResponsePacket = (
  successful: boolean,
  successPacket: SuccessResponsePacket,
  errorPacket: ErrorResponsePacket
) => (successful ? successPacket : errorPacket);

export const removeFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) reject(err.message);
      resolve(
        SuccessResponsePacket(
          `Successfully removed file: ${filePath}`,
          {}
        )
      );
    });
  });
};

export const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
  let base64 = "";
  let a, b, c, d;
  let chunk;
  const encodings =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const bytes = new Uint8Array(arrayBuffer);
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1
    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }
  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1
    base64 += encodings[a] + encodings[b] + "==";
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1
    base64 += encodings[a] + encodings[b] + encodings[c] + "=";
  }
  return base64;
};

export const filetypeFromUrl = (url: string) => {
  const splitUrl = url.split(/[#?]/)[0];
  const filetypeSplit = splitUrl.split(".");
  return filetypeSplit.pop()?.trim();
};

export const get = async (url: string, provideSlackAuthorization = true) =>
  await fetch(url, {
    method: "get",
    mode: "cors",
    headers: provideSlackAuthorization
      ? { Authorization: `Bearer ${Config.slackbot.token}` }
      : {},
  });

export const downloadFileFromUrl = async (
  url: string,
  provideSlackAuthorization = true
) => {
  const res = await get(url, provideSlackAuthorization);
  if (!res || !res.body) throw new Error(`Fetch from url failed: ${url}`);
  const publicPath = `/${randomUUID()}.${filetypeFromUrl(url)}`;
  await pipeline(
    // @ts-expect-error ts(2339)
    res.body,
    fs.createWriteStream(join(pubdirLocal, publicPath))
  );
  return publicPath;
};

export const getFileBase64FromUrl = (
  url: string,
  provideSlackAuthorization = true
) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "get",
      mode: "cors",
      headers: provideSlackAuthorization
        ? { Authorization: `Bearer ${Config.slackbot.token}` }
        : {},
    })
      .then((res) => {
        if (res.status === 200) {
          res
            .arrayBuffer()
            .then((buffer) => resolve(arrayBufferToBase64(buffer)))
            .catch((err: string) => reject(err));
        } else {
          reject(res.status);
        }
      })
      .catch((err: any) => reject(err));
  });
};

export const getSlackFileBase64 = async (slackFileUrl: string) =>
  await getFileBase64FromUrl(slackFileUrl, true);

if (require.main === module) {
  const app = express();

  const host = Config.api.host;
  const port = Config.api.port;

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(
    fileUpload({
      createParentPath: true,
    })
  );
  app.use(IOTWRouter);

  app.listen(port, host, () => {
    console.log(`Server running...\nAddress: ${host}:${port}`);
  });
} else {
  Logger.log(
    `IOTW-api: server.ts / server.js not run as main...this is likely \
    unintentional! Please check your code.`
  );
}
