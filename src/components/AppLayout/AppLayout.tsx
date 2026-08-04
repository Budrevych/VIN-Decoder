import { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <div className={`${styles.headerInner} container`}>
          <Link to="/" className={styles.headerBrand}>
            <span className={styles.headerLogoIcon}>🚘</span>
            <div className={styles.headerBrandText}>
              <span className={styles.headerTitle}>VIN Decoder</span>
              <span className={styles.headerSubtitle}>NHTSA Vehicle API</span>
            </div>
          </Link>

          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              end
            >
              Decode VIN
            </NavLink>
            <NavLink
              to="/variables"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              Variables List
            </NavLink>
          </nav>
        </div>
      </header>

      <main className={`${styles.mainContent} container`}>{children}</main>
    </div>
  );
};
