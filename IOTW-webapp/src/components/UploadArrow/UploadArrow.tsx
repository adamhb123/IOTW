import React from "react";
import "./UploadArrow.scss";

export interface UploadArrowProps {
  direction: "previous" | "next";
  target: "upload-carousel" | "upload-full-overlay";
  onClick?: React.EventHandler<any>;
}
export type UploadArrowType = React.FunctionComponent<UploadArrowProps>;
export const UploadArrow: UploadArrowType = (
  props: UploadArrowProps
): React.ReactElement<
  unknown,
  string | React.JSXElementConstructor<unknown>
> => {
  return (
    <button
      className={`upload-arrow ${props.target}-upload-arrow`}
      id={props.direction}
      onClick={(evt) => {
        if (props.onClick) props.onClick(evt);
      }}
    >
      <span>{props.direction === "previous" ? "<" : ">"}</span>
    </button>
  );
};

export default UploadArrow;
