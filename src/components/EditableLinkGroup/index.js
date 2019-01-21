import React, { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import router from 'umi/router';
import { Button, Icon } from 'antd';
import styles from './index.less';
import CustomIcon from '@/icons';

// TODO: 添加逻辑

class EditableLinkGroup extends PureComponent {
  static propTypes = {
    links: PropTypes.array,
  };

  static defaultProps = {
    links: [],
  };

  render() {
    const { links } = this.props;
    return (
      <div className={styles.linkGroup}>
        {links.map(link => (
          <Button
            key={`linkGroup-item-${link.id || link.title}`}
            size="large"
            type="primary"
            ghost
            onClick={() => router.push(link.href)}
            style={{ marginRight: 25 }}
          >
            {createElement(link.custom ? CustomIcon : Icon, {
              type: link.icon,
              style: { fontSize: 24, verticalAlign: 'top' },
            })}
            {link.title}
          </Button>
        ))}
      </div>
    );
  }
}

export default EditableLinkGroup;
