import React from "react";
import styles from "./LoginTabSwitcher.module.scss";

export type Tab = "web3" | "email";

interface LoginTabSwitcherProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const LoginTabSwitcher: React.FC<LoginTabSwitcherProps> = ({ activeTab, onTabChange }) => (
  <div className={styles.container} role="tablist">
    <img
      src="/wallet-login/logoanddesigns/border.svg"
      alt=""
      className={styles.borderFrame}
      aria-hidden="true"
    />
    <button
      role="tab"
      aria-selected={activeTab === "web3"}
      className={`${styles.tab} ${activeTab === "web3" ? styles.tabActive : styles.tabInactive}`}
      onClick={() => onTabChange("web3")}
      type="button"
    >
      Web3 Wallet
    </button>
    <button
      role="tab"
      aria-selected={activeTab === "email"}
      className={`${styles.tab} ${activeTab === "email" ? styles.tabActive : styles.tabInactive}`}
      onClick={() => onTabChange("email")}
      type="button"
    >
      Email
    </button>
  </div>
);

export default LoginTabSwitcher;
