import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { VehicleVariable, VariableLookupValue } from '../../types/nhtsa';
import { getVariableList, getVariableValues } from '../../api/nhtsa';
import { Loader } from '../../components/Loader/Loader';
import { Toast } from '../../components/Toast/Toast';
import { stripHtml } from '../../utils/stripHtml';
import styles from './VariableDetailsPage.module.css';

export const VariableDetailsPage = () => {
  const { variableId } = useParams<{ variableId: string }>();
  const idNumber = Number(variableId);

  const [variable, setVariable] = useState<VehicleVariable | null>(null);
  const [lookupValues, setLookupValues] = useState<VariableLookupValue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setLookupError(null);

    getVariableList()
      .then(async (list) => {
        if (!isMounted) return;

        const found = list.find((v) => v.ID === idNumber);
        if (!found) {
          setError(`Variable with ID ${variableId} was not found`);
          return;
        }

        setVariable(found);

        if (found.DataType && found.DataType.toLowerCase().includes('lookup')) {
          try {
            const values = await getVariableValues(found.ID);
            if (isMounted) {
              setLookupValues(values);
            }
          } catch (e: unknown) {
            if (isMounted) {
              const msg = e instanceof Error ? e.message : 'Failed to load allowable lookup values';
              setLookupError(msg);
            }
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load variable details');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [variableId, idNumber]);

  if (isLoading) {
    return <Loader label={`Loading details for variable #${variableId}...`} />;
  }

  if (error || !variable) {
    return (
      <div className={styles.detailsPage}>
        <Link to="/variables" className={styles.backLink}>
          ← Back to Variables List
        </Link>
        <div className={styles.errorCard} role="alert">
          <div className={styles.errorCardIcon}>⚠️</div>
          <div>
            <h3 className={styles.errorCardTitle}>Variable Not Found</h3>
            <p className={styles.errorCardMessage}>{error || 'Specified ID does not exist'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailsPage}>
      <Link to="/variables" className={styles.backLink}>
        ← Back to All Variables
      </Link>

      <article className={styles.detailsCard}>
        <header className={styles.detailsCardHeader}>
          <div className={styles.detailsCardBadges}>
            <span className={`${styles.badge} ${styles.badgeId}`}>ID: {variable.ID}</span>
            {variable.GroupName && (
              <span className={`${styles.badge} ${styles.badgeGroup}`}>{variable.GroupName}</span>
            )}
            <span className={`${styles.badge} ${styles.badgeType}`}>Data Type: {variable.DataType || 'String'}</span>
          </div>
          <h1 className={styles.detailsCardTitle}>{variable.Name}</h1>
        </header>

        <section>
          <h3 className={styles.detailsCardSectionTitle}>Variable Description:</h3>
          <div className={styles.detailsCardDescription}>
            {stripHtml(variable.Description) || 'No description available for this variable in the NHTSA database.'}
          </div>
        </section>

        {lookupError && (
          <section>
            <h3 className={styles.detailsCardSectionTitle}>Allowable Values:</h3>
            <div className={styles.errorCard} role="alert">
              <div className={styles.errorCardIcon}>⚠️</div>
              <div>
                <p className={styles.errorCardMessage}>{lookupError}</p>
              </div>
            </div>
          </section>
        )}

        {lookupValues.length > 0 && (
          <section>
            <h3 className={styles.detailsCardSectionTitle}>
              Allowable Values (Lookup Options — {lookupValues.length}):
            </h3>
            <div className={styles.tableResponsive}>
              <table className={styles.resultsTable}>
                <thead>
                  <tr>
                    <th>Value ID</th>
                    <th>Value Name</th>
                  </tr>
                </thead>
                <tbody>
                  {lookupValues.map((val) => (
                    <tr key={val.Id}>
                      <td>#{val.Id}</td>
                      <td><strong>{val.Name || val.ElementName}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </article>

      {lookupError && <Toast message={lookupError} type="error" />}
    </div>
  );
};
