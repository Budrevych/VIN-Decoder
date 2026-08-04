import { useState } from 'react';
import { useVinDecoder } from '../../hooks/useVinDecoder';
import { useVinHistory } from '../../hooks/useVinHistory';
import { VinForm } from '../../components/VinForm/VinForm';
import { RecentVinList } from '../../components/RecentVinList/RecentVinList';
import { DecodeResults } from '../../components/DecodeResults/DecodeResults';
import { Loader } from '../../components/Loader/Loader';
import { Toast } from '../../components/Toast/Toast';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const { history, addHistoryItem, clearHistory } = useVinHistory();

  const handleSuccessSave = (item: Parameters<typeof addHistoryItem>[0]) => {
    addHistoryItem(item);
    setToast({ message: `VIN code ${item.vin} decoded successfully`, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClearHistory = () => {
    clearHistory();
    setToast({ message: 'Search history cleared', type: 'info' });
    setTimeout(() => setToast(null), 3000);
  };

  const {
    state,
    validationError,
    setValidationError,
    decode,
    loadFromHistory,
  } = useVinDecoder(handleSuccessSave);

  const isLoading = state.status === 'loading';

  return (
    <div className="page home-page">
      <section className={styles.heroSection}>
        <h1 className={styles.heroSectionTitle}>Vehicle VIN Code Decoder</h1>
        <p className={styles.heroSectionDescription}>
          Enter a 17-character vehicle identification number to instantly retrieve official
          technical specifications from the NHTSA database.
        </p>
      </section>

      <VinForm
        onDecode={decode}
        isLoading={isLoading}
        validationError={validationError}
        onClearValidation={() => setValidationError(null)}
      />

      <RecentVinList
        history={history}
        onSelect={loadFromHistory}
        onClear={handleClearHistory}
        isLoading={isLoading}
      />

      {isLoading && <Loader label="Fetching technical specifications from NHTSA..." />}

      {state.status === 'error' && (
        <div className={styles.errorCard} role="alert">
          <div className={styles.errorCardIcon}>❌</div>
          <div>
            <h3 className={styles.errorCardTitle}>Decoding Request Failed</h3>
            <p className={styles.errorCardMessage}>{state.message}</p>
          </div>
        </div>
      )}

      {state.status === 'idle' && (
        <div className={styles.idleBanner}>
          <div className={styles.idleBannerIcon}>🔍</div>
          <div>
            <h3 className={styles.idleBannerTitle}>Ready to Decode</h3>
            <p className={styles.idleBannerSubtitle}>
              Please enter a VIN code above or select one from sample buttons/history list.
            </p>
          </div>
        </div>
      )}

      {state.status === 'success' && (
        <DecodeResults
          data={state.data}
          summary={state.historyRecord.summary}
          vin={state.historyRecord.vin}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};
