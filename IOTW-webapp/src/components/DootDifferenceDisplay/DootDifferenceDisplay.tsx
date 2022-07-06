export const DootDifferenceDisplay = (props: { dootDifference: number }) => (
  <div className="doot-difference-display">
    <span className="doot-difference-text">
      <span className="bidi-arrow">⬍</span>
      {props.dootDifference}
    </span>
  </div>
);

export default DootDifferenceDisplay;
