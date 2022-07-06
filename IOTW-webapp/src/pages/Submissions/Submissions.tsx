import React from "react";
import { SubmissionGallery } from "../../components/SubmissionGallery";
import "./Submissions.scss";

type SubmissionsProps = { userOnly: boolean };

const Submissions: React.FunctionComponent<SubmissionsProps> = (
  props: SubmissionsProps
) => <SubmissionGallery userOnly title="Your Submissions"></SubmissionGallery>;

export default Submissions;
