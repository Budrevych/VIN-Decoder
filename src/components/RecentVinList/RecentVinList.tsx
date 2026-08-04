import { VinHistoryItem } from '../../types/nhtsa';
import styles from './RecentVinList.module.css';

interface RecentVinListProps {
  history: VinHistoryItem[];
  onSelect: (item: VinHistoryItem) => void;
  onClear: () => void;
  isLoading: boolean;
}

export const RecentVinList = ({
  history,
  onSelect,
  onClear,
  isLoading,
}: RecentVinListProps) => {
  if (history.length === 0) return null;

  return (
    <div className={styles.historyCard}>
      <div className={styles.historyCardHeader}>
        <h3 className={styles.historyCardTitle}>
          🕒 Last 3 decoded VINs (History):
        </h3>
        <button
          type="button"
          className={styles.btnText}
          onClick={onClear}
          title="Clear history"
        >
          Clear
        </button>
      </div>

      <div className={styles.historyGrid}>
        {history.map((item) => {
          const dateStr = new Date(item.requestedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <button
              key={item.vin + item.requestedAt}
              className={styles.historyItem}
              onClick={() => onSelect(item)}
              disabled={isLoading}
            >
              <div className={styles.historyItemVin}>{item.vin}</div>
              <div className={styles.historyItemSummary}>
                {item.summary.make || item.summary.model ? (
                  <span>
                    {item.summary.make} {item.summary.model} {item.summary.modelYear}
                  </span>
                ) : (
                  <span>View Details</span>
                )}
              </div>
              <div className={styles.historyItemTime}>{dateStr}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
