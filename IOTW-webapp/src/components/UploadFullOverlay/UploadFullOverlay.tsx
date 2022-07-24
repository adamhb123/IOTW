import React from "react";
import IOTWShared from "iotw-shared";
import "./UploadFullOverlay.scss";

interface UploadFullOverlayProps {
  id?: string;
  className?: string;
  onClick?: React.MouseEventHandler;
  src: string;
}
type UploadFullOverlayType = React.FunctionComponent<UploadFullOverlayProps>;
export const UploadFullOverlay: UploadFullOverlayType = (
  props: UploadFullOverlayProps
) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [src, setSrc] = React.useState<string>("");
  React.useEffect(() => {
    const dom = document as IOTWShared.IOTWDOM;
    if (!dom.setUploadFullOverlaySrc)
      dom.setUploadFullOverlaySrc = setSrc;
    if (!dom.setUploadFullOverlayVisible)
      dom.setUploadFullOverlayVisible = setVisible;
  }, []);
  React.useEffect(() => {
    const dom = document as IOTWShared.IOTWDOM;
    dom.uploadFullOverlayVisible = visible;
    const screenDarkener = dom.getElementById("screen-darkener");
    if (screenDarkener) screenDarkener.style.opacity = visible ? "0.75" : "0";
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

  const toggleVisibility = React.useCallback(() => {
    setVisible(!visible);
  }, [visible]);
  return (
    <div
      id={props.id ?? ""}
      className={`upload-full-overlay ${props.className ?? ""}`}
      style={{ visibility: visible ? "visible" : "hidden" }}
      onClick={toggleVisibility}
    >
      <img src={src} alt="Upload Full View"></img>
    </div>
  );
};

export default UploadFullOverlay;
