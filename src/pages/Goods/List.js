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
const filterMap = [
  {
    key: 'name',
    text: '商品名称'
  },
  {
    key: 'isbn',
    text: 'isbn'
  },
  {
    key: 'bookCode',
    text: '商品编码'
  },
];
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: 'isbn',
    dataIndex: 'isbn',
  },
  {
    title: '作者',
    dataIndex: 'author',
  },
  {
    title: '出版社',
    dataIndex: 'press',
  },
  {
    title: '销量',
    dataIndex: 'sales',
    sorter: (a, b) => a.sales - b.sales,
  },
  {
    title: '价格',
    dataIndex: 'price',
    sorter: (a, b) => a.price - b.price,
    render(val) {
      return `￥${val.toFixed(2)}`;
    },
  },
  {
    title: '星币价',
    dataIndex: 'starPrice',
    sorter: (a, b) => a.starPrice - b.starPrice,
    render(val) {
      return `￥${val.toFixed(2)}`;
    },
  },
  {
    title: '星币抵扣',
    dataIndex: 'starDeduction',
    sorter: (a, b) => a.starDeduction - b.starDeduction,
    render(val) {
      return `￥${val.toFixed(2)}`;
    },
  },
  {
    title: '库存',
    dataIndex: 'stockNumber',
    sorter: (a, b) => a.stockNumber - b.stockNumber,
  },
];

const showTableTotal = total => `共${total}条数据`;
const PAGE_SIZE = 10;

/* eslint react/no-multi-comp:0 */
@connect(({ goodsList, loading }) => ({
  goodsList,
  loading: loading.models.goodsList,
}))
@Form.create()
class List extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchKey: '',
      searchValue: '',
      offset: 1,
      limit: PAGE_SIZE,
    };
  }

  componentDidMount() {
    this.handleRefresh();
  }

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const formValues = form.getFieldsValue();
    const { searchKey, searchValue } = formValues;
    this.fetchOrders(searchKey, searchValue, 1);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetchOrders('', '', 1);
  };

  handleRefresh = () => {
    const { searchKey, searchValue, offset } = this.state;
    this.fetchOrders(searchKey, searchValue, offset);
  };

  handlePageChange = pagination => {
    const { searchKey, searchValue } = this.state;
    this.fetchOrders(searchKey, searchValue, pagination);
  };

  handleRow = row => ({
    // eslint-disable-next-line
    onClick: event => {
      router.push(`/goods/detail/${row.goodsId}`);
    },
  });

  fetchOrders(searchKey, searchValue, offset) {
    const { dispatch } = this.props;
    const { limit } = this.state;

    this.setState({
      offset,
      searchKey,
      searchValue
    });
    dispatch({
      type: 'goodsList/fetch',
      payload: {
        offset,
        limit,
        filter: !searchKey && !searchValue ? [] : [{key: searchKey, values: [searchValue]}],
        sort: []
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
            <FormItem label="搜索商品" className="nowrap">
              {getFieldDecorator('searchValue')(<Input placeholder="请输入" allowClear />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="筛选条件" className="nowrap">
              {getFieldDecorator('searchKey')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={0} key={0}>
                    全部
                  </Option>
                  {filterMap.map(item => (
                    <Option value={item.key} key={item.key}>
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
      goodsList: { data },
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
      <PageHeaderWrapper title="商品列表">
        <Card>
          <Fragment>
            <div className={styles.tableListForm}>
              { this.renderForm() }
            </div>
            <StandardTable
              rowKey="goodsId"
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
