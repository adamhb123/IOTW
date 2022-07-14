import mysql from "mysql2";
import Config from "./config";
import IOTWShared from "iotw-shared";
const dbConfig = {
  host: Config.mysql.host,
  port: Config.mysql.port,
  user: Config.mysql.user,
  password: Config.mysql.password,
  database: Config.mysql.databaseName,
};

mysql.createConnection(dbConfig);
const conn = mysql.createPool(dbConfig).promise();

/**
 * Retrieves and returns all uploads in the database
 *
 * @returns All uploads in the database
 */
export async function getUploads(
  maxCount: number | null = null,
  sortedBy: IOTWShared.Enums.SortedBy = IOTWShared.Enums.SortedBy.Updoots,
  direction: IOTWShared.Enums.Direction = IOTWShared.Enums.Direction.Descending
): Promise<any> {
  // could replace 'uploads' with a 'TABLE_NAME' envvar
  let result;
  const sqlDirection = IOTWShared.Methods.directionEnumToSQL(direction);
  await conn
    .query(
      `SELECT * FROM uploads ORDER BY ${sortedBy} ${sqlDirection} ${
        maxCount ? `LIMIT ${maxCount}` : ""
      }`
    )
    .then(([_rows]: any) => {
      result = _rows;
    })
    .catch((err: any) => (result = err));
  return result;
}

export async function getUploadsByColumnValue(
  column_id: string,
  column_value: string,
  maxCount: number | null = null,
  sortedBy: IOTWShared.Enums.SortedBy = IOTWShared.Enums.SortedBy.Updoots,
  direction: IOTWShared.Enums.Direction = IOTWShared.Enums.Direction.Descending
): Promise<any> {
  let result: any;
  const sqlDirection = IOTWShared.Methods.directionEnumToSQL(direction);
  await conn
    .query(
      `SELECT * FROM uploads WHERE ${column_id}=${column_value} ORDER BY ${sortedBy} ${sqlDirection} ${
        maxCount ? `LIMIT ${maxCount}` : ""
      }`
    )
    .then(([_rows]: any) => {
      result = _rows;
    })
    .catch((err: any) => (result = err));
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
