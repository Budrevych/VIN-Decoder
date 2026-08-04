import styles from './Loader.module.css';

interface LoaderProps {
  label?: string;
}

export const Loader = ({ label = 'Decoding VIN code...' }: LoaderProps) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loaderLabel}>{label}</p>
    </div>
  );
};
