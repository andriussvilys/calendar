import arrowLeft from "../../images/chevron_left_FILL0_wght400_GRAD0_opsz48.svg";
import arrowRight from "../../images/chevron_right_FILL0_wght400_GRAD0_opsz48.svg";
import "./ArrowControls.css";

interface ArrowControlsProps {
  onForwardArrowClick: Function;
  onBackArrowClick: Function;
}

const ArrowControls = ({
  onForwardArrowClick,
  onBackArrowClick,
}: ArrowControlsProps) => {
  return (
    <div className="container">
      <button
        id="headerControls_prev"
        className="button button_round button-controls prev"
        onClick={() => onBackArrowClick()}
      >
        <img src={arrowLeft} alt="arrow left" />
      </button>
      <button
        id="headerControls_next"
        className="button button_round button-controls next"
        onClick={() => onForwardArrowClick()}
      >
        <img src={arrowRight} alt="arrow right" />
      </button>
    </div>
  );
};

export default ArrowControls;
