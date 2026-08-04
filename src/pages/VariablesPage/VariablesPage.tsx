import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { VehicleVariable } from '../../types/nhtsa';
import { getVariableList } from '../../api/nhtsa';
import { Loader } from '../../components/Loader/Loader';
import { stripHtml } from '../../utils/stripHtml';
import styles from './VariablesPage.module.css';

const PAGE_SIZE = 15;

export const VariablesPage = () => {
  const [variables, setVariables] = useState<VehicleVariable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getVariableList()
      .then((data) => {
        if (isMounted) {
          setVariables(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load variables list');
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
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  const filteredVariables = useMemo(() => {
    if (!searchQuery.trim()) return variables;
    const q = searchQuery.toLowerCase().trim();
    return variables.filter(
      (v) =>
        v.Name.toLowerCase().includes(q) ||
        (v.GroupName && v.GroupName.toLowerCase().includes(q)) ||
        (v.Description && stripHtml(v.Description).toLowerCase().includes(q))
    );
  }, [variables, searchQuery]);

  const visibleVariables = useMemo(() => {
    return filteredVariables.slice(0, visibleCount);
  }, [filteredVariables, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const hasMore = visibleCount < filteredVariables.length;

  return (
    <div className="page variables-page">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageHeaderTitle}>NHTSA Vehicle Variables Catalog</h1>
        <p className={styles.pageHeaderSubtitle}>
          Complete repository of all vehicle specifications, attributes, and parameters decoded by NHTSA.
        </p>
      </div>

      <div className={styles.searchBarCard}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}>🔎</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search variable by name, group or keyword (e.g. Engine, Make, Brake)..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => {
                setSearchQuery('');
                setVisibleCount(PAGE_SIZE);
              }}
            >
              ✕
            </button>
          )}
        </div>
        <div className={styles.searchMeta}>
          Displaying <strong>{visibleVariables.length}</strong> of <strong>{filteredVariables.length}</strong> matching variables ({variables.length} total)
        </div>
      </div>

      {isLoading && <Loader label="Loading variables catalog..." />}

      {error && (
        <div className={styles.errorCard} role="alert">
          <div className={styles.errorCardIcon}>❌</div>
          <div>
            <h3 className={styles.errorCardTitle}>Failed to load catalog</h3>
            <p className={styles.errorCardMessage}>{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className={styles.variablesGrid}>
            {filteredVariables.length === 0 ? (
              <div className={styles.emptySearch}>
                No variables found matching «<strong>{searchQuery}</strong>».
              </div>
            ) : (
              visibleVariables.map((variable) => (
                <div key={variable.ID} className={styles.variableCard}>
                  <div className={styles.variableCardHeader}>
                    <span className={styles.variableCardId}>ID: {variable.ID}</span>
                    {variable.GroupName && (
                      <span className={styles.variableCardGroup}>{variable.GroupName}</span>
                    )}
                  </div>
                  <h3 className={styles.variableCardName}>{variable.Name}</h3>
                  <p className={styles.variableCardDesc}>
                    {stripHtml(variable.Description).slice(0, 140)}
                    {stripHtml(variable.Description).length > 140 ? '...' : ''}
                  </p>
                  <div className={styles.variableCardFooter}>
                    <Link
                      to={`/variables/${variable.ID}`}
                      className={styles.btnOutlineSm}
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button
                type="button"
                className={styles.loadMoreBtn}
                onClick={handleLoadMore}
              >
                Load Next 15 Variables ({filteredVariables.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
