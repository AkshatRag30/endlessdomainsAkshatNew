import React, { useState } from "react";
import styles from "./RememberMeForgotRow.module.scss";

interface RememberMeForgotRowProps {
  forgotHref?: string;
}

const RememberMeForgotRow: React.FC<RememberMeForgotRowProps> = ({
  forgotHref = "/forgot-password",
}) => {
  const [checked, setChecked] = useState(true);

  return (
    <div className={styles.row}>
      <label className={styles.checkLabel}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className={styles.checkbox}
        />
        <span className={styles.checkText}>Remember Me</span>
      </label>
      <a href={forgotHref} className={styles.forgotLink}>
        Forgot Password?
      </a>
    </div>
  );
};

export default RememberMeForgotRow;
