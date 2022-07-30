import React from "react";
import { Card, CardImg, CardBody, CardTitle, CardText } from "reactstrap";
import Logger from "easylogger-ts";
import APIMiddleware from "../../misc/APIMiddleware";
import "./UploadCard.scss";
import Config from "../../misc/config";
import UploadDataDisplay from "../UploadDataDisplay";
type UploadCardPropTypes = {
  id?: string;
  author: string;
  thumbnailUrl: string;
  thumbnailMimetype?: string; // Required if Config.api.storeUploadsLocally=false
  apiPublicFileUrl?: string; // Required if Config.api.storeUploadsLocally=true
  dootDifference: number;
  onClick: React.MouseEventHandler;
  children?: string;
};

const UploadCard = (props: UploadCardPropTypes) => {
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  React.useEffect(() => {
    (async () => {
      let thumbnail: string;
      if (!Config.api.storeUploadsLocally) {
        if (!props.thumbnailMimetype) {
          throw new Error(
            "UploadCard: props.thumbnailMimetype required if Config.api.storeUploadsLocally=false"
          );
        }
        thumbnail = APIMiddleware.formatSlackImageSrc(
          await APIMiddleware.getSlackImageBase64(props.thumbnailUrl, true)
        );
      } else {
        if (!props.apiPublicFileUrl) {
          throw new Error(
            "UploadCard: props.apiPublicFileUrl required if Config.api.storeUploadsLocally=true"
          );
        }
        thumbnail = APIMiddleware.formatSlackImageSrc(props.apiPublicFileUrl);
      }
      if (!thumbnail)
        throw new Error(
          `UploadCard: Failed to get thumbnail for unknown reason, props.apiPublicFileUrl possibly undefined (props.apiPublicFileUrl=${props.apiPublicFileUrl})`
        );
      setThumbnailUrl(thumbnail);
    })().catch((err: string) => Logger.log(err));
  }, [props.thumbnailUrl, props.thumbnailMimetype, props.apiPublicFileUrl]);
  return (
    <Card id={props.id} className="upload-card" style={{ width: "18rem" }}>
      <div className="image-container">
        <CardImg variant="top" src={thumbnailUrl} onClick={props.onClick} />
      </div>
      <hr className="my-0" />
      <CardBody id="upload-card-body">
        <CardTitle>
          Author: <span className="author-name-text">{props.author}</span>
        </CardTitle>
        <CardText>{props.children}</CardText>
        <UploadDataDisplay dootDifference={props.dootDifference} />
      </CardBody>
    </Card>
  );
};

export default UploadCard;
