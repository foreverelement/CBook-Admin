import React, { memo } from 'react';
import { Row, Col, Card } from 'antd';

import EditableLinkGroup from '@/components/EditableLinkGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const links = [
  {
    title: '回收订单管理',
    href: '/orders/recycle/list',
    icon: 'recycle',
    custom: true,
  },
  {
    title: '买书订单管理',
    href: '/orders/buy/list',
    icon: 'order',
    custom: true,
  },
];

const Workplace = memo(() => (
  <PageHeaderWrapper>
    <Row>
      <Col span={24}>
        <Card style={{ marginBottom: 24 }} title="订单管理" bordered={false}>
          <EditableLinkGroup onAdd={() => {}} links={links} />
        </Card>
      </Col>
    </Row>
  </PageHeaderWrapper>
));

export default Workplace;
