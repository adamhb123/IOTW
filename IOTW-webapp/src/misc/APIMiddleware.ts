import fetch from "cross-fetch";
import Logger from "easylogger-ts";
import Config from "./config";
import { pathJoin } from "../../../IOTW-shared/src/utility";

const apiUrl = `${Config.api.host}:${Config.api.port}`;

export enum SortedBy {
  Updoots = "updoots",
  Downdoots = "downdoots",
  UploaderID = "uploaderID",
  CSHUsername = "cshUsername",
  DootDifference = "dootDifference",
  AbsoluteDootDifference = "absoluteDootDifference",
}






export const downloadSlackImage = async (url: string): Promise<string> => {
  const res = await fetch(`${apiUrl}/getSlackFile?url=${url}`);
  if (res.status >= 400) throw new Error(res.statusText);
  const json = await res.json();
  if (!json.data.publicFileUrl) throw new Error("Invalid response JSON");
  return json.data.publicFileUrl;
};

export const formatSlackImageSrc = (src: string, mimetype?: string) =>
  Config.api.storeSubmissionsLocally
    ? pathJoin(apiUrl, src)
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

export const getSubmissions = async (
  maxCount = -1,
  sortedBy: SortedBy = SortedBy.Updoots,
  direction: Direction = Direction.Descending

): Promise<UploadsResponseStructure[]> => {
  // Retrieve submissions, sorting is handled server-side by iotw-api
  const queryParams = `maxCount=${maxCount}&sortedBy=${sortedBy}&direction=${direction}`;
  Logger.warn(queryParams);
  const res = await fetch(
    `${Config.api.host}:${Config.api.port}/uploads?${queryParams}`
  );
  const json = await res.json();
  return json.data;
};

export const getSubmissionByColumnValue = async (
  columnID: string,
  columnValue: string,
  maxCount = -1,
  sortedBy: SortedBy = SortedBy.Updoots,
  direction: Direction = Direction.Descending
): Promise<UploadsResponseStructure[]> => {
  const queryParams = `columnID=${columnID}&columnValue=${columnValue}&maxCount=${maxCount}&sortedBy=${sortedBy}&direction=${direction}`;
  const res = await fetch(`${apiUrl}/uploadsByColumnValue?${queryParams}`);
  const json = await res.json();
  return json.data;
};
const APIMiddleware = {
  SortedBy,
  sortedByToString,
  Direction,
  directionToString,
  getSlackImageBase64,
  formatSlackImageSrc,
  getMaxRetries,
  setMaxRetries,
  getSubmissions,
  getSubmissionByColumnValue,
};
export default APIMiddleware;
