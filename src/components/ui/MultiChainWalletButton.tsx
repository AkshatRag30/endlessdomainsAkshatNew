import React from "react";
import styles from "./MultiChainWalletButton.module.scss";

interface MultiChainWalletButtonProps {
  icons: string[];
  onClick?: () => void;
}

const MultiChainWalletButton: React.FC<MultiChainWalletButtonProps> = ({ icons, onClick }) => (
  <button type="button" className={styles.btn} onClick={onClick}>
    <img
      src="/wallet-login/logoanddesigns/border.svg"
      alt=""
      className={styles.borderFrame}
      aria-hidden="true"
    />
    <div className={styles.inner}>
      <span className={styles.label}>Login With Multi-Chain Wallet</span>
      <span className={styles.iconGroup}>
        {icons.map((src, i) => (
          <img key={i} src={src} alt="" className={styles.icon} aria-hidden="true" />
        ))}
      </span>
    </div>
  </button>
);

export default MultiChainWalletButton;
