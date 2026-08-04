import { useState, FormEvent, ChangeEvent } from 'react';
import styles from './VinForm.module.css';

interface VinFormProps {
  onDecode: (vin: string) => void;
  isLoading: boolean;
  validationError: string | null;
  onClearValidation: () => void;
}

export const VinForm = ({
  onDecode,
  isLoading,
  validationError,
  onClearValidation,
}: VinFormProps) => {
  const [vin, setVin] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onDecode(vin);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVin(e.target.value);
    if (validationError) {
      onClearValidation();
    }
  };

  const applySampleVin = (sample: string) => {
    setVin(sample);
    if (validationError) {
      onClearValidation();
    }
    onDecode(sample);
  };

  return (
    <div className={styles.vinFormCard}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="vin-input" className={styles.vinFormLabel}>
          Enter vehicle VIN code (up to 17 characters):
        </label>
        <div className={styles.vinFormInputGroup}>
          <input
            id="vin-input"
            type="text"
            className={`${styles.vinFormInput} ${validationError ? styles.vinFormInputError : ''}`}
            placeholder="e.g., 1FTFW1CT5DFC10312"
            value={vin}
            onChange={handleChange}
            maxLength={17}
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className={styles.vinFormBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Decoding...' : 'Decode VIN'}
          </button>
        </div>

        {validationError && (
          <div className={styles.vinFormError} role="alert">
            ⚠️ {validationError}
          </div>
        )}
      </form>

      <div className={styles.vinFormSamples}>
        <span className={styles.vinFormSamplesTitle}>Sample VINs:</span>
        <button
          type="button"
          className={styles.sampleBadge}
          onClick={() => applySampleVin('1FTFW1CT5DFC10312')}
          disabled={isLoading}
        >
          Ford (1FTFW...)
        </button>
        <button
          type="button"
          className={styles.sampleBadge}
          onClick={() => applySampleVin('JN1AZ4EH7DM430111')}
          disabled={isLoading}
        >
          Nissan (JN1AZ...)
        </button>
        <button
          type="button"
          className={styles.sampleBadge}
          onClick={() => applySampleVin('WDDGF3BB4DF968608')}
          disabled={isLoading}
        >
          Mercedes (WDDGF...)
        </button>
      </div>
    </div>
  );
};
