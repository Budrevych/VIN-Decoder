import { NhtsaResult } from '../../types/nhtsa';
import { Link } from 'react-router-dom';
import styles from './ResultRow.module.css';

interface ResultRowProps {
  result: NhtsaResult;
}

export const ResultRow = ({ result }: ResultRowProps) => {
  return (
    <tr className={styles.resultRow}>
      <td className={styles.resultRowVariable}>
        <Link to={`/variables/${result.VariableId}`} className={styles.resultRowLink}>
          {result.Variable}
        </Link>
      </td>
      <td className={styles.resultRowValue}>
        <span className={styles.resultRowBadge}>{result.Value}</span>
      </td>
    </tr>
  );
};
