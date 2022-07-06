import React from "react";
import { Card, CardImg, CardBody, CardTitle, CardText } from "reactstrap";
import Logger from "easylogger-ts";
import APIMiddleware from "../../misc/APIMiddleware";
import "./SubmissionCard.scss";
import Config from "../../misc/config";
import DootDifferenceDisplay from "../DootDifferenceDisplay";
type SubmissionCardPropTypes = {
  id?: string;
  author: string;
  thumbnailUrl: string;
  thumbnailMimetype?: string; // Required if Config.api.storeSubmissionsLocally=false
  apiPublicFileUrl?: string; // Required if Config.api.storeSubmissionsLocally=true
  dootDifference: number;
  onClick: React.MouseEventHandler;
  children?: string;
};

const SubmissionCard = (props: SubmissionCardPropTypes) => {
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  React.useEffect(() => {
    (async () => {
      let thumbnail: string;
      if (!Config.api.storeSubmissionsLocally) {
        if (!props.thumbnailMimetype) {
          throw new Error(
            "SubmissionCard: props.thumbnailMimetype required if Config.api.storeSubmissionsLocally=false"
          );
        }
        thumbnail = APIMiddleware.formatSlackImageSrc(
          await APIMiddleware.getSlackImageBase64(props.thumbnailUrl, true)
        );
      } else {
        if (!props.apiPublicFileUrl) {
          throw new Error(
            "SubmissionCard: props.apiPublicFileUrl required if Config.api.storeSubmissionsLocally=true"
          );
        }
        thumbnail = APIMiddleware.formatSlackImageSrc(props.apiPublicFileUrl);
      }
      if (!thumbnail)
        throw new Error(
          `SubmissionCard: Failed to get thumbnail for unknown reason, props.apiPublicFileUrl possibly undefined (props.apiPublicFileUrl=${props.apiPublicFileUrl})`
        );
      setThumbnailUrl(thumbnail);
    })().catch((err: string) => Logger.log(err));
  }, [props.thumbnailUrl, props.thumbnailMimetype, props.apiPublicFileUrl]);
  return (
    <Card id={props.id} className="submission-card" style={{ width: "18rem" }}>
      <div className="image-container">
        <CardImg variant="top" src={thumbnailUrl} onClick={props.onClick} />
      </div>
      <hr className="my-0" />
      <CardBody id="submission-card-body">
        <CardTitle>
          Author: <span className="author-name-text">{props.author}</span>
        </CardTitle>
        <CardText>{props.children}</CardText>
        <DootDifferenceDisplay dootDifference={props.dootDifference} />
      </CardBody>
    </Card>
  );
};

export default SubmissionCard;
