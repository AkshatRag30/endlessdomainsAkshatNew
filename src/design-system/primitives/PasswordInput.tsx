import React, { useState } from "react";
import styles from "./PasswordInput.module.scss";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  id,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={styles.inputRow}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={styles.input}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <img
            src="/wallet-login/right_side_assets/eye-icon.svg"
            alt=""
            className={styles.eyeIcon}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
