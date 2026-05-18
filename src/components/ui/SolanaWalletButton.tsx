import React from "react";
import styles from "./SolanaWalletButton.module.scss";

interface SolanaWalletButtonProps {
  icon: string;
  onClick?: () => void;
}

const SolanaWalletButton: React.FC<SolanaWalletButtonProps> = ({ icon, onClick }) => (
  <button type="button" className={styles.btn} onClick={onClick}>
    <img
      src="/wallet-login/logoanddesigns/border.svg"
      alt=""
      className={styles.borderFrame}
      aria-hidden="true"
    />
    <div className={styles.inner}>
      <span className={styles.label}>Login With Solana Wallet</span>
      <img src={icon} alt="" className={styles.icon} aria-hidden="true" />
    </div>
  </button>
);

export default SolanaWalletButton;
