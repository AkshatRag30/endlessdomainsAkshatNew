import React, { useState } from "react";
import LoginTabSwitcher, { Tab } from "@/components/ui/LoginTabSwitcher";
import MultiChainWalletButton from "@/components/ui/MultiChainWalletButton";
import SolanaWalletButton from "@/components/ui/SolanaWalletButton";
import EmailLoginView from "./EmailLoginView";
import styles from "./LoginRightSection.module.scss";

interface LoginRightSectionProps {
  logoSrc: string;
}

const LoginRightSection: React.FC<LoginRightSectionProps> = ({ logoSrc }) => {
  const [activeTab, setActiveTab] = useState<Tab>("web3");

  return (
    <main className={styles.container}>
      <div className={styles.inner}>

        <div className={styles.gridBlock}>
          <img src={logoSrc} alt="Endless Domains" className={styles.logo} />
          <div className={styles.headingBlock}>
            <h1 className={styles.heading}>Login to your Account</h1>
            <p className={styles.subheading}>
              See what is going on with your business
            </p>
          </div>
        </div>

        <LoginTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "web3" ? (
          <div className={styles.buttonStack}>
            <MultiChainWalletButton
              icons={["/wallet-login/right_side_assets/coingroupbutton.svg"]}
            />
            <SolanaWalletButton
              icon="/wallet-login/right_side_assets/coinicon.svg"
            />
          </div>
        ) : (
          <EmailLoginView />
        )}

        <p className={styles.footer}>
          Don&apos;t have an account yet?{" "}
          <a href="/signup" className={styles.signupLink}>Signup</a>
        </p>

      </div>
    </main>
  );
};

export default LoginRightSection;
