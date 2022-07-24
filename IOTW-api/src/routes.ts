// External modules
import express, { Request, Response } from "express";
import Logger from "easylogger-ts";
import IOTWShared from "iotw-shared";
// Local modules
import * as Database from "./database";
import * as Server from "./server";

const router = express.Router();

// Serve static files
router.use(express.static(`${__dirname}/../public`));

router.get("/downloadSlackFile", async (req: Request, res: Response) => {
  if (!req.query.url)
    res
      .status(400)
      .send(Server.ErrorResponsePacket(null, "Invalid query parameters"));
  if (typeof req.query.url === "string") {
    const filePublicUrl = await Server.downloadFileFromUrl(req.query.url).catch(
      (err: string) => Logger.log(err)
    );
    if (filePublicUrl)
      res.status(200).send(
        Server.SuccessResponsePacket(null, {
          filePublicUrl: filePublicUrl,
        })
      );
    else
      res
        .status(500)
        .send(
          Server.ErrorResponsePacket(
            null,
            `Could not download file at url: ${req.query.url}`
          )
        );
  } else {
    res.status(422).send(
      // Could flesh out the error handling 422: (err): ResPack.AsJ(f,"Fail",`${x}` query parameter not provided)
      Server.ErrorResponsePacket(null, "'url' query parameter not provided")
    );
  }
});
router.get("/getSlackFileBase64", async (req: Request, res: Response) => {
  if (typeof req.query.url === "string") {
    const base64Data = await Server.getSlackFileBase64(req.query.url).catch(
      (err: string) => Logger.log(err)
    );
    const mimetype = Server.MIMETypeFromUrl(req.query.url);
    if (base64Data && mimetype)
      res.send(
        Server.SuccessResponsePacket(null, {
          base64Data: base64Data,
          mimetype: mimetype,
        })
      );
    else if (!base64Data)
      res.send(
        Server.ErrorResponsePacket(
          null,
          `Could not get base64Data from file at url: ${req.query.url}`
        )
      );
    else if (!mimetype)
      res.send(
        Server.ErrorResponsePacket(
          null,
          `Could not get mimetype from file at url: ${req.query.url}`
        )
      );
  } else {
    res.send(Server.ErrorResponsePacket(null, "url query param not provided"));
  }
});

router.get("/uploads", (req: Request, res: Response) => {
  const maxCount =
    typeof req.query.maxCount === "string"
      ? Number.parseInt(req.query.maxCount)
      : null;
  const sortedBy =
    <IOTWShared.UploadColumnID>req.query.uploadColumnID ??
    IOTWShared.UploadColumnID.Updoots;
  const direction =
    <IOTWShared.Direction>req.query.direction ??
    IOTWShared.Direction.Descending;
  Database.getUploads(maxCount, sortedBy, direction)
    .then((response: Database.dbQueryResult) => {
      const successful: boolean =
        Boolean(response) &&
        !Object.prototype.hasOwnProperty.call(response, "message");
      res.send(
        Server.ConditionalResponsePacket(
          successful,
          Server.SuccessResponsePacket(null, { uploads: response }),
          Server.ErrorResponsePacket(null, (response ?? "").toString())
        )
      );
    })
    .catch((err: unknown) =>
      res
        .status(500)
        .send(Server.ErrorResponsePacket(null, `Caught exception: ${err}`))
    );
});

router.get("/uploadsByColumnValue", (req: Request, res: Response) => {
  if (
    typeof req.query.columnID === "string" &&
    typeof req.query.columnValue === "string"
  ) {
    const maxCount =
      typeof req.query.maxCount === "string"
        ? Number.parseInt(req.query.maxCount)
        : null;
    const uploadColumnID =
      <IOTWShared.UploadColumnID>req.query.uploadColumnID ??
      IOTWShared.UploadColumnID.Updoots;
    const direction =
      <IOTWShared.Direction>req.query.direction ??
      IOTWShared.Direction.Descending;
    Database.getUploadsByColumnValue(
      req.query.columnID,
      req.query.columnValue,
      maxCount,
      uploadColumnID,
      direction
    )
      .then((response: Database.dbQueryResult) => {
        const successful: boolean =
          Boolean(response) &&
          !Object.prototype.hasOwnProperty.call(response, "message");
        res.send(
          Server.ConditionalResponsePacket(
            successful,
            Server.SuccessResponsePacket(null, { uploads: response }),
            Server.ErrorResponsePacket(
              null,
              `Failed to getUploadsByColumnValue${
                response ? `, response: ${response}` : ""
              }`
            )
          )
        );
      })
      .catch((err: unknown) =>
        res.status(500).send(Server.ErrorResponsePacket(null, `Error: ${err}`))
      );
  }
});

router.post("/upload", async (req: Request, res: Response) => {
  try {
    let files = req.files || req.body.files;
    console.log(req.body);
    const cshUsername = req.body.cshUsername ?? "brewer";
    if (!files || !cshUsername) {
      const response = Server.ErrorResponsePacket(
        null,
        "Malformed request! Analyze the 'data' property within this response to see what we received...",
        {
          cshUsername: cshUsername,
          files: files,
        }
      );
      res.send(response);
    } else {
      const successfulUploads: string[] = [];
      let attemptedUploadCount = 0;
      if (typeof files !== "string") {
        /* Don't really need this functionality right now
        // Direct file upload through API
        const fileKeys = Object.keys(files);
        console.log("filekeys: ", fileKeys);
        for(const fileKey of fileKeys) {
          let fileArray: UploadedFile[];
          if(!Array.isArray(files[fileKey])) fileArray = [<UploadedFile>files[fileKey]];
          else fileArray = <UploadedFile[]>files[fileKey];
          for(let i = 0; i < fileArray.length; i++) {
            attemptedUploadCount++;
            const file = <UploadedFile>fileArray[i];
            const fileName = `${uuidv4()}${file.name}`;
            console.log("file:", file);
            const fileLocalPath = path.join(Config.mysql.uploadsDirectory, fileName);
            await file.mv(fileLocalPath); Don't need to save files
            await IOTWShared.insertUploads(fileLocalPath, userID);
            successfulUploads.push(fileName);
          }*/
        res.send("Direct uploads disabled!");
      } else {
        // File upload through slack interaction
        files = JSON.parse(files);
        for (const file of files) {
          attemptedUploadCount++;
          console.log("Uploaded file in loop: ");
          console.log(file);
          const thumbnailUrlSplit = file.thumb_360.split("/");
          const thumbnailFiletype =
            thumbnailUrlSplit[thumbnailUrlSplit.length - 1].split("."); // ["filename", "png"]
          const thumbnailMimetype =
            Server.MIMETypes[thumbnailFiletype[thumbnailFiletype.length - 1]]; // "image/png"
          const apiPublicFileUrl = await Server.downloadFileFromUrl(
            file.url_private,
            true
          );
          await Database.insertUploads(
            file.user,
            cshUsername,
            apiPublicFileUrl,
            file.url_private,
            file.mimetype,
            file.thumb_360,
            thumbnailMimetype
          );
          successfulUploads.push(file.url_private);
        }
      }
      const uploadDelta = attemptedUploadCount - successfulUploads.length;
      if (uploadDelta !== 0)
        throw new Error("Upload aborted, at least 1 upload failed!");
      res.send(
        Server.SuccessResponsePacket(
          `Successfully uploaded all (${successfulUploads.length}) files!`,
          {
            files: successfulUploads,
          }
        )
      );
    }
  } catch (err: unknown) {
    console.error(err);
    res.status(500).send(Server.ErrorResponsePacket(null, `${err}`));
  }
});

export default router;
