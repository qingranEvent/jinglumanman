import { Link, Outlet } from 'umi';
import styles from './index.less';

export default function Layout() {
  window._AMapSecurityConfig = {
    securityJsCode: "a75af0fc3ee062a0718b0aa2b9375446",
  };
  return (
    <div className={styles.navs}>
      <Outlet />
    </div>
  );
}
