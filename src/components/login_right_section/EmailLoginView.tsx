import React from "react";
import ContinueWithGoogleButton from "@/components/ui/ContinueWithGoogleButton";
import RememberMeForgotRow from "@/components/ui/RememberMeForgotRow";
import TextInput from "@/design-system/primitives/TextInput";
import PasswordInput from "@/design-system/primitives/PasswordInput";
import styles from "./EmailLoginView.module.scss";

const EmailLoginView: React.FC = () => (
  <div className={styles.container}>
    <ContinueWithGoogleButton />

    <div className={styles.fields}>
      <TextInput
        id="email"
        label="Email"
        type="email"
        placeholder="mail@abc.com"
      />
      <div className={styles.passwordGroup}>
        <PasswordInput
          id="password"
          label="Password"
          placeholder="•••••••••••••••••"
        />
        <RememberMeForgotRow />
      </div>
    </div>

    <a href="/login" className={styles.loginLink}>
      Login
    </a>
  </div>
);

export default EmailLoginView;
