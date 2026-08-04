import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose?: () => void;
}

export const Toast = ({ message, type = 'success' }: ToastProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'error':
        return styles.toastError;
      case 'info':
        return styles.toastInfo;
      case 'success':
      default:
        return styles.toastSuccess;
    }
  };

  return (
    <div className={`${styles.toast} ${getTypeClass()}`} role="status">
      <span className={styles.toastIcon}>{getIcon()}</span>
      <span className={styles.toastMessage}>{message}</span>
    </div>
  );
};
