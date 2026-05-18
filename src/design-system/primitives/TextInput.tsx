import React from "react";
import styles from "./TextInput.module.scss";

interface TextInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  id,
}) => (
  <div className={styles.wrapper}>
    {label && (
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    )}
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={styles.input}
    />
  </div>
);

export default TextInput;
