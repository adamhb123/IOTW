import React from "react";
import { UploadGallery } from "../../components/UploadGallery";
import "./Uploads.scss";

type UploadsProps = { userOnly: boolean };

const Uploads: React.FunctionComponent<UploadsProps> = (
  props: UploadsProps
) => (
  <UploadGallery userOnly={props.userOnly} title="Your Uploads"></UploadGallery>
);

export default Uploads;
