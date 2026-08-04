import { DecodeResponse, VehicleSummary } from '../../types/nhtsa';
import { ResultRow } from '../ResultRow/ResultRow';
import styles from './DecodeResults.module.css';

interface DecodeResultsProps {
  data: DecodeResponse;
  summary: VehicleSummary;
  vin: string;
}

export const DecodeResults = ({
  data,
  summary,
  vin,
}: DecodeResultsProps) => {
  const results = data.Results || [];

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <div className={styles.summaryCardBadge}>VIN: {vin}</div>
          <h2 className={styles.summaryCardTitle}>
            {summary.make || 'Unknown Make'} {summary.model || ''}{' '}
            {summary.modelYear ? `(${summary.modelYear})` : ''}
          </h2>
        </div>

        <div className={styles.summaryCardGrid}>
          <div className={styles.summaryCardItem}>
            <span className={styles.summaryCardLabel}>Make / Manufacturer:</span>
            <span className={styles.summaryCardVal}>{summary.make || summary.manufacturer || '—'}</span>
          </div>
          <div className={styles.summaryCardItem}>
            <span className={styles.summaryCardLabel}>Model:</span>
            <span className={styles.summaryCardVal}>{summary.model || '—'}</span>
          </div>
          <div className={styles.summaryCardItem}>
            <span className={styles.summaryCardLabel}>Model Year:</span>
            <span className={styles.summaryCardVal}>{summary.modelYear || '—'}</span>
          </div>
          <div className={styles.summaryCardItem}>
            <span className={styles.summaryCardLabel}>Vehicle Type:</span>
            <span className={styles.summaryCardVal}>{summary.vehicleType || '—'}</span>
          </div>
          <div className={styles.summaryCardItem}>
            <span className={styles.summaryCardLabel}>Plant Country:</span>
            <span className={styles.summaryCardVal}>{summary.plantCountry || '—'}</span>
          </div>
          <div className={styles.summaryCardItem}>
            <span className={styles.summaryCardLabel}>Populated Fields:</span>
            <span className={`${styles.summaryCardVal} ${styles.summaryCardValHighlight}`}>
              {results.length} non-empty fields
            </span>
          </div>
        </div>
      </div>

      {data.Message && (
        <div className={styles.apiMessageBox}>
          <div className={styles.apiMessageBoxTitle}>ℹ️ NHTSA API Official Message:</div>
          <div>{data.Message}</div>
        </div>
      )}

      <div className={styles.tableCard}>
        <div className={styles.tableCardHeader}>
          <h3 className={styles.tableCardTitle}>Detailed Specifications List</h3>
          <p className={styles.tableCardSubtitle}>
            Click on any variable name to inspect its full official description
          </p>
        </div>

        {results.length === 0 ? (
          <div className={styles.emptyResults}>
            No populated specification values were returned for this VIN code.
          </div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th>Variable Name</th>
                  <th>Decoded Value</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <ResultRow key={item.VariableId || index} result={item} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
