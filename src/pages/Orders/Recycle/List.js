import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
// import Link from 'umi/link';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Select, Button, Badge } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const orderStatusMap = {
  1000: {
    text: '平台审核',
    style: 'processing',
  },
  2001: {
    text: '审核失败',
    style: 'error',
  },
  2002: {
    text: '用户取消',
    style: 'warning',
  },
  1001: {
    text: '物流取件',
    style: 'processing',
  },
  2003: {
    text: '取件失败',
    style: 'error',
  },
  1002: {
    text: '验收书籍',
    style: 'processing',
  },
  1003: {
    text: '书费到账',
    style: 'success',
  },
};

const getOrderStatus = key => orderStatusMap[key] || {}

const columns = [
  {
    title: '订单号',
    dataIndex: 'orderCode',
  },
  {
    title: '下单人',
    dataIndex: 'orderName',
  },
  {
    title: '手机号',
    dataIndex: 'orderMobile',
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
    render(val) {
      return <Badge status={getOrderStatus(val).style} text={getOrderStatus(val).text} />;
    },
  },
  {
    title: '预期收入',
    dataIndex: 'expectIncome',
    sorter: (a, b) => a.expectIncome - b.expectIncome,
    render(val) {
      return `￥${val.toFixed(2)}`;
    },
  },
  {
    title: '实际收入',
    dataIndex: 'actualIncome',
    sorter: (a, b) => a.actualIncome - b.actualIncome,
    render(val) {
      return `￥${val.toFixed(2)}`;
    },
  },
  {
    title: '揽件时间',
    dataIndex: 'appointment',
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
  },
  /* {
    title: '揽件地址',
    dataIndex: 'orderAddress',
    render: (text, record) => (
      <Fragment>
        {`${record.orderProvince}${record.orderCity}${record.orderRegion}${record.orderAddress}`}
      </Fragment>
    ),
  },
  {
    title: '操作',
    render: (text, record) => (
      <Link to={`/orders/recycle/detail/${record.orderCode}`}>查看详情</Link>
    ),
  }, */
];

const getOrderStatusList = () =>
  Object.keys(orderStatusMap).map(status => ({
    text: orderStatusMap[status].text,
    value: +status,
  }));

const showTableTotal = total => `共${total}条数据`;
const PAGE_SIZE = 10;

/* eslint react/no-multi-comp:0 */
@connect(({ recycle, loading }) => ({
  recycle,
  loading: loading.models.recycle,
}))
@Form.create()
class List extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      orderCode: '',
      offset: 1,
      limit: PAGE_SIZE,
      status: 0,
    };

    this.orderStautsList = getOrderStatusList();
  }

  componentDidMount() {
    this.handleRefresh();
  }

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const formValues = form.getFieldsValue();
    const { orderCode = '', status = 0 } = formValues;
    this.fetchOrders(orderCode, status, 1);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetchOrders('', 0, 1);
  };

  handleRefresh = () => {
    const { orderCode, status, offset } = this.state;
    this.fetchOrders(orderCode, status, offset);
  };

  handlePageChange = pagination => {
    const { orderCode, status } = this.state;
    this.fetchOrders(orderCode, status, pagination);
  };

  handleRow = row => ({
    // eslint-disable-next-line
    onClick: event => {
      router.push(`/orders/recycle/detail/${row.orderCode}`);
    },
  });

  fetchOrders(orderCode, status, offset) {
    const { dispatch } = this.props;
    const { limit } = this.state;

    this.setState({
      orderCode,
      status,
      offset,
    });

    dispatch({
      type: 'recycle/fetchOrders',
      payload: {
        orderCode,
        offset,
        limit,
        status,
      },
    });
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="搜索订单" className="nowrap">
              {getFieldDecorator('orderCode')(<Input placeholder="请输入" allowClear />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态" className="nowrap">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={0} key={0}>
                    全部
                  </Option>
                  {this.orderStautsList.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.text}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button icon="sync" style={{ marginLeft: 8 }} onClick={this.handleRefresh}>
                刷新
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      recycle: { data },
      loading,
    } = this.props;

    data.pagination = {
      ...data.pagination,
      defaultPageSize: PAGE_SIZE,
      showTotal: showTableTotal,
      onChange: this.handlePageChange,
      showSizeChanger: false,
    };

    return (
      <PageHeaderWrapper title="回收订单列表">
        <Card>
          <Fragment>
            <div className={styles.tableListForm}>
              { this.renderForm() }
            </div>
            <StandardTable
              rowKey="orderCode"
              size="middle"
              rowClassName={styles.orderTableRow}
              selectedRows={[]}
              showAlert={false}
              rowSelection={null}
              scroll={{x: 970}}
              loading={loading}
              data={data}
              columns={columns}
              onRow={this.handleRow}
            />
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
