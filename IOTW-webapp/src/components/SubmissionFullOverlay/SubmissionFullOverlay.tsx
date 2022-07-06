import React from "react";
import "./SubmissionFullOverlay.scss";

interface SubmissionFullOverlayProps {
  id?: string;
  className?: string;
  onClick?: React.MouseEventHandler;
  src: string;
}
type SubmissionFullOverlayType = React.FunctionComponent<SubmissionFullOverlayProps>;
export const SubmissionFullOverlay: SubmissionFullOverlayType = (
  props: SubmissionFullOverlayProps
) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [src, setSrc] = React.useState<string>("");
  React.useEffect(() => {
    const dom = document as any;
    if (!dom.setSubmissionFullOverlaySrc)
      dom.setSubmissionFullOverlaySrc = setSrc;
    if (!dom.setSubmissionFullOverlayVisible)
      dom.setSubmissionFullOverlayVisible = setVisible;
  }, []);
  React.useEffect(() => {
    const dom = document as any;
    dom.submissionFullOverlayVisible = visible;
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
      "submission-full-overlay"
    )[0] as HTMLElement;

    if (thisElem) thisElem.style.top = `${top}px`;
  });

  const toggleVisibility = React.useCallback(() => {
    setVisible(!visible);
  }, [visible]);
  return (
    <div
      id={props.id ?? ""}
      className={`submission-full-overlay ${props.className ?? ""}`}
      style={{ visibility: visible ? "visible" : "hidden" }}
      onClick={toggleVisibility}
    >
      <img src={src} alt="Submission Full View"></img>
    </div>
  );
};

export default SubmissionFullOverlay;
