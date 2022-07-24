import mysql from "mysql2";
import Config from "./config";
import IOTWShared from "iotw-shared";

export type dbQueryResult =
  | mysql.RowDataPacket[]
  | mysql.RowDataPacket[][]
  | mysql.OkPacket
  | mysql.OkPacket[]
  | mysql.ResultSetHeader
  | undefined;

const dbConfig = {
  host: Config.mysql.host,
  port: Config.mysql.port,
  user: Config.mysql.user,
  password: Config.mysql.password,
  database: Config.mysql.databaseName,
};

mysql.createConnection(dbConfig);
const conn = mysql.createPool(dbConfig).promise();

export interface ApiError {
  code: number;
  message: string;
}
export const ApiError = (errorInfo: ApiError) => errorInfo;
const isApiError = (x: unknown): x is ApiError =>
  IOTWShared.typeguardValidator(x, [{ name: "", type: "string" }]);

/**
 * Retrieves and returns all uploads in the database
 *
 * @returns All uploads in the database
 */
export async function getUploads(
  maxCount: number | null = null,
  sortedBy: IOTWShared.UploadColumnID = IOTWShared.UploadColumnID.Updoots,
  direction: IOTWShared.Direction = IOTWShared.Direction.Descending
): Promise<dbQueryResult> {
  // could replace 'uploads' with a 'TABLE_NAME' envvar
  let result: dbQueryResult;
  const sqlDirection = IOTWShared.directionEnumToSQL(direction);
  await conn
    .query(
      `SELECT * FROM uploads ORDER BY ${sortedBy} ${sqlDirection} ${
        maxCount ? `LIMIT ${maxCount}` : ""
      }`
    )
    .then(([_rows]) => {
      result = _rows;
    })
    .catch((err) => (result = err));
  return result;
}

export async function getUploadsByColumnValue(
  uploadColumnID: string,
  uploadColumnValue: string,
  maxCount: number | null = null,
  sortedBy: IOTWShared.UploadColumnID = IOTWShared.UploadColumnID.Updoots,
  direction: IOTWShared.Direction = IOTWShared.Direction.Descending
): Promise<dbQueryResult> {
  let result: dbQueryResult;
  const sqlDirection = IOTWShared.directionEnumToSQL(direction);
  await conn
    .query(
      `SELECT * FROM uploads WHERE ${uploadColumnID}=${uploadColumnValue} ORDER BY ${sortedBy} ${sqlDirection} ${
        maxCount ? `LIMIT ${maxCount}` : ""
      }`
    )
    .then(([_rows]) => {
      result = _rows;
    })
    .catch((err) => (result = err));
  return result;
}

/**
 * Inserts the described uploads into the database
 *
 * @param uploaderID - The uploader's slack ID
 * @param cshUsername - The uploader's csh username
 * @param apiPublicFileUrl - DB api url
 * @param imageUrl - Slack private image url
 * @param imageMimetype - Slack private image mimetype
 * @param thumbnailUrl - Slack thumb_360 url
 * @param thumbnailMimetype - Slack thumb_360 mimetype
 * @param updoots - Updoot count
 * @param downdoots - Downdoot count
 * @returns Result of insertion query
 */
export async function insertUploads(
  uploaderID: string,
  cshUsername: string,
  apiPublicFileUrl: string,
  imageUrl: string,
  imageMimetype: string,
  thumbnailUrl: string,
  thumbnailMimetype: string,
  updoots = 0,
  downdoots = 0
): Promise<any> {
  const query = `INSERT INTO uploads (uploaderID, cshUsername, apiPublicFileUrl, imageUrl, imageMimetype, thumbnailUrl, thumbnailMimetype, updoots, downdoots)
            VALUES ("${uploaderID}", "${cshUsername}", "${apiPublicFileUrl}","${imageUrl}", "${imageMimetype}", "${thumbnailUrl}", "${thumbnailMimetype}", ${updoots}, ${downdoots})`;
  return await conn.query(query);
}

export default {
  getUploads,
  getUploadsByColumnValue,
  insertUploads,
};
