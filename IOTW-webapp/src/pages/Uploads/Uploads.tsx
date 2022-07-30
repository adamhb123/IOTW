import React from "react";
import AuthVerifier from "../../components/AuthVerifier";
import { UploadGallery } from "../../components/UploadGallery";
import "./Uploads.scss";

type UploadsProps = { userOnly?: boolean };

const Uploads: React.FunctionComponent<UploadsProps> = (
  props: UploadsProps
) => (
  <AuthVerifier>
    <UploadGallery
      userOnly={props.userOnly ?? false}
      title={props.userOnly ? "Your Uploads" : "Uploads"}
    ></UploadGallery>
  </AuthVerifier>
);

export default Uploads;
