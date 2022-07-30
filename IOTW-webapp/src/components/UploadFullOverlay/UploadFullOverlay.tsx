import React from "react";
import IOTWShared from "iotw-shared";
import * as CSS from "csstype";
import UploadArrow from "../UploadArrow";
import "./UploadFullOverlay.scss";
import UploadDataDisplay from "../UploadDataDisplay";

interface UploadFullOverlayProps {
  id?: string;
  className?: string;
  onClick?: React.MouseEventHandler;
  src?: string;
  dootDifference?: number;
}
type UploadFullOverlayType = React.FunctionComponent<UploadFullOverlayProps>;
export const UploadFullOverlay: UploadFullOverlayType = (
  props: UploadFullOverlayProps
) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [src, setSrc] = React.useState<string>("");
  const [dootDifference, setDootDifference] = React.useState<number>(0);
  React.useEffect(() => {
    const dom = document as IOTWShared.UploadDisplayDOM;
    if (!dom.setUploadFullOverlaySrc) dom.setUploadFullOverlaySrc = setSrc;
    if (!dom.setUploadFullOverlayVisible)
      dom.setUploadFullOverlayVisible = setVisible;
    if (!dom.setUploadFullOverlayDootDifference)
      dom.setUploadFullOverlayDootDifference = setDootDifference;
  }, []);
  React.useEffect(() => {
    const dom = document as IOTWShared.UploadDisplayDOM;
    dom.uploadFullOverlayVisible = visible;
    const screenDarkener = dom.getElementById("screen-darkener");
    if (screenDarkener) {
      screenDarkener.style.opacity = visible ? "0.75" : "0";
      screenDarkener.style.pointerEvents = visible
        ? ("auto" as CSS.Property.PointerEvents)
        : ("none" as CSS.Property.PointerEvents);
    }
  }, [visible, src]);

  // Setup repositioning
  setInterval(() => {
    const screenDarkener = document.getElementById(
      "screen-darkener"
    ) as HTMLElement;
    if (screenDarkener) {
      const body = document.body;
      const html = document.documentElement;
      const pageHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      screenDarkener.style.height = `${pageHeight}px`;
    }
  }, 1000);
  document.addEventListener("scroll", () => {
    const body = document.body;
    const html = document.documentElement;
    const top = html.scrollTop || body.scrollTop;
    const thisElem = document.getElementsByClassName(
      "upload-full-overlay"
    )[0] as HTMLElement;
    if (thisElem) thisElem.style.top = `${top}px`;
  });

  const hideFullOverlayOnClick = React.useCallback(() => {
    const dom = document as IOTWShared.UploadDisplayDOM;
    if (!dom.userDragging) {
      if (dom.setUploadFullOverlayVisible)
        dom.setUploadFullOverlayVisible(false);
    }
    // Reset userDragging
    dom.userDragging = false;
  }, [props.src]);
  return (
    <div
      id={props.id ?? ""}
      className={`upload-full-overlay ${props.className ?? ""}`}
      onClick={hideFullOverlayOnClick}
      style={{
        opacity: visible ? "1" : "0",
        pointerEvents: visible
          ? ("auto" as CSS.Property.PointerEvents)
          : ("none" as CSS.Property.PointerEvents),
      }}
    >
      <UploadDataDisplay dootDifference={props.dootDifference ?? 0} />
      <UploadArrow target="upload-full-overlay" direction="previous" />
      <UploadArrow target="upload-full-overlay" direction="next" />
      <img src={src} alt="Upload Full View"></img>
    </div>
  );
};

export default UploadFullOverlay;
