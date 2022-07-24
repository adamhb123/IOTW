import fetch from "cross-fetch";
import Logger from "easylogger-ts";
import Config from "./config";
import IOTWShared from "iotw-shared";

const apiUrl = `${Config.api.host}:${Config.api.port}`;



export const downloadSlackImage = async (url: string): Promise<string> => {
  const res = await fetch(`${apiUrl}/getSlackFile?url=${url}`);
  if (res.status >= 400) throw new Error(res.statusText);
  const json = await res.json();
  if (!json.data.publicFileUrl) throw new Error("Invalid response JSON");
  return json.data.publicFileUrl;
};

export const formatSlackImageSrc = (src: string, mimetype?: string) =>
  Config.api.storeUploadsLocally
    ? IOTWShared.pathJoin(apiUrl, src)
    : `data:${mimetype};base64, ${src}`;

// useLocalStorage generally only useful with small images (AKA thumbnails)
// We manage this storage manually ourselves because we inline the base64 of the images to reduce server
// load. This is likely absolutely dumb, as we have plenty of server space, so this is likely to be modified
// in the future. By trying to be too smart, we are become dumb. Also browsers only have like 5 mb local storage
// so this doesn't really help all that much, but hey, I tried here.
export const getSlackImageBase64 = async (
  url: string,
  useLocalStorage?: boolean
): Promise<string> => {
  let checkCache;
  if (useLocalStorage) {
    checkCache = localStorage.getItem(url);
    Logger.log(`Check cache: ${checkCache?.substring(0, 20)}`);
    if (checkCache) return JSON.parse(checkCache) as string;
  }
  const res = await fetch(`${apiUrl}/getSlackFileBase64?url=${url}`);
  if (res.status >= 400) throw new Error(res.statusText);
  const json = await res.json();
  if (json.data.base64Data) {
    if (useLocalStorage) {
      // Store in memory to avoid unnecessary fetches
      try {
        localStorage.setItem(url, JSON.stringify(json.data.base64Data));
      } catch (err: any) {
        // Probably QueryExceeded
        Logger.warn("localStorage maxed out");
      }
    }
    return json.data.base64Data;
  }
  throw new Error(`Failed to getSlackImageBase64 json data given url: ${url}`);
};

let MAX_RETRIES = 5;

export const getMaxRetries = () => MAX_RETRIES;
export const setMaxRetries = (maxRetries: number) => (MAX_RETRIES = maxRetries);

export const getUploads = async (
  maxCount: number | null = null,
  sortedBy: IOTWShared.UploadColumnID = IOTWShared.UploadColumnID.Updoots,
  direction: IOTWShared.Direction = IOTWShared.Direction.Descending

): Promise<IOTWShared.UploadsResponseStructure[]> => {
  // Retrieve uploads, sorting is handled server-side by iotw-api
  const queryParams = `maxCount=${maxCount}&sortedBy=${sortedBy}&direction=${direction}`;
  Logger.warn(queryParams);
  const res = await fetch(
    `${Config.api.host}:${Config.api.port}/uploads?${queryParams}`
  );
  const json = await res.json();
  return json.data.uploads;
};

export const getUploadByColumnValue = async (
  columnID: string,
  columnValue: string,
  maxCount: number | null = null,
  sortedBy?: IOTWShared.UploadColumnID,
  direction?: IOTWShared.Direction
): Promise<IOTWShared.UploadsResponseStructure[]> => {
  sortedBy = sortedBy ?? IOTWShared.UploadColumnID.Updoots;
  direction = direction ?? IOTWShared.Direction.Descending;
  const queryParams = `columnID=${columnID}&columnValue=${columnValue}&maxCount=${maxCount}&sortedBy=${sortedBy}&direction=${direction}`;
  const res = await fetch(`${apiUrl}/uploadsByColumnValue?${queryParams}`);
  const json = await res.json();
  return json.data.uploads;
};
const APIMiddleware = {
  getSlackImageBase64,
  formatSlackImageSrc,
  getMaxRetries,
  setMaxRetries,
  getUploads,
  getUploadByColumnValue,
};
export default APIMiddleware;
