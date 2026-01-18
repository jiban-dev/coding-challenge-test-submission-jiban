//Implemented Error Message Component - Jiban
import React from "react";
import styles from "./ErrorMessage.module.css";

type ErrorMessageProps = {
    message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null;

    return <div className={styles.error}>{message}</div>;
};

export default ErrorMessage;