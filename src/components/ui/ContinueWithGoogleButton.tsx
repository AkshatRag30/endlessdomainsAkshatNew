import React from "react";
import styles from "./ContinueWithGoogleButton.module.scss";

interface ContinueWithGoogleButtonProps {
  onClick?: () => void;
}

const ContinueWithGoogleButton: React.FC<ContinueWithGoogleButtonProps> = ({ onClick }) => (
  <button type="button" className={styles.btn} onClick={onClick}>
    <img
      src="/wallet-login/right_side_assets/google-g-icon.png"
      alt=""
      className={styles.icon}
      aria-hidden="true"
    />
    <span className={styles.label}>Continue With Google</span>
  </button>
);

export default ContinueWithGoogleButton;
