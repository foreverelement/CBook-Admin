import React, { Fragment, memo } from 'react';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import { title } from '../defaultSettings';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 {title}
  </Fragment>
);

const UserLayout = memo(({ children }) => (
  <DocumentTitle title={`登录 - ${title}`}>
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>星月童书</span>
            </Link>
          </div>
          <div className={styles.desc}>星月童书后台管理系统</div>
        </div>
        {children}
      </div>
      <GlobalFooter copyright={copyright} />
    </div>
  </DocumentTitle>
));

export default UserLayout;
