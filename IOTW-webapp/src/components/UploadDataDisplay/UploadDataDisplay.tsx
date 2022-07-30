export const UploadDataDisplay = (props: { dootDifference: number }) => (
  <div className="upload-data-display">
    <span className="upload-data-text">
      <span className="bidi-arrow">⬍</span>
      {props.dootDifference}
    </span>
  </div>
);

export default UploadDataDisplay;
