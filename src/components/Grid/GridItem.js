import React from 'react';
import { Col } from 'antd';
import responsive from './responsive';

const GridItem = ({ column, children, ...restProps }) => (
  <Col {...responsive[column]} {...restProps}>
    {children}
  </Col>
);

export default GridItem;
