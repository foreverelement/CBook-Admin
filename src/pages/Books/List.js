import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const statusMap = {
  1001: '图书入库',
  1002: '图书上架',
  1003: '图书卖出',
  2000: '图书作废'
};
const filterMap = [
  {
    key: 'name',
    text: '图书名称'
  },
  {
    key: 'isbn',
    text: 'isbn'
  },
  {
    key: 'bookCode',
    text: '图书编码'
  },
];
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '编码',
    dataIndex: 'bookCode',
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
    title: '图书状态',
    dataIndex: 'status',
    render(val) {
      return statusMap[val];
    }
  },
  {
    title: '出版社',
    dataIndex: 'press',
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
    title: '销售价格',
    dataIndex: 'sellPrice',
    sorter: (a, b) => a.sellPrice - b.sellPrice,
    render(val) {
      return `￥${val.toFixed(2)}`;
    },
  },
  {
    title: '星币价格',
    dataIndex: 'starPrice',
    sorter: (a, b) => a.starPrice - b.starPrice,
    render(val) {
      return `￥${val.toFixed(2)}`;
    },
  },
];

const showTableTotal = total => `共${total}条数据`;
const PAGE_SIZE = 10;

/* eslint react/no-multi-comp:0 */
@connect(({ bookList, loading }) => ({
  bookList,
  loading: loading.models.bookList,
}))
@Form.create()
class List extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchKey: 'name',
      searchStatus: '',
      searchValue: '',
      offset: 1,
      limit: PAGE_SIZE,
    };

    this.statusList = Object.keys(statusMap).map(key => ({value: Number(key), text: statusMap[key]}))
  }

  componentDidMount() {
    this.handleRefresh();
  }

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const formValues = form.getFieldsValue();
    const { searchKey, searchStatus, searchValue } = formValues;
    this.fetchOrders(searchKey, searchStatus, searchValue, 1);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetchOrders('name', '', '', 1);
  };

  handleRefresh = () => {
    const { searchKey, searchStatus, searchValue, offset } = this.state;
    this.fetchOrders(searchKey, searchStatus, searchValue, offset);
  };

  handlePageChange = pagination => {
    const { searchKey, searchStatus, searchValue } = this.state;
    this.fetchOrders(searchKey, searchStatus, searchValue, pagination);
  };

  handleRow = row => ({
    // eslint-disable-next-line
    onClick: event => {
      router.push(`/books/detail/${row.bookCode}`);
    },
  });

  fetchOrders(searchKey, searchStatus, searchValue, offset) {
    const { dispatch } = this.props;
    const { limit } = this.state;
    const filter = !searchValue ? [] : [{key: searchKey, values: [searchValue]}];

    if (searchStatus) {
      filter.push({ key: 'status', values: [searchStatus] });
    }

    this.setState({
      offset,
      searchKey,
      searchStatus,
      searchValue
    });
    dispatch({
      type: 'bookList/fetchBooks',
      payload: {
        offset,
        limit,
        filter,
        sort: []
      },
    });
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { searchKey } = this.state;

    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
          <Col md={6} sm={24}>
            <FormItem label="筛选条件" className="nowrap">
              {getFieldDecorator('searchKey', {
                initialValue: searchKey
              })(
                <Select placeholder="请选择">
                  {filterMap.map(item => (
                    <Option value={item.key} key={item.key}>
                      {item.text}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="图书状态" className="nowrap">
              {getFieldDecorator('searchStatus')(
                <Select placeholder="请选择">
                  <Option value={0} key={0}>全部</Option>
                  {this.statusList.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.text}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="搜索图书" className="nowrap">
              {getFieldDecorator('searchValue')(<Input placeholder="请输入" allowClear />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
      bookList: { data },
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
      <PageHeaderWrapper title="图书列表">
        <Card>
          <Fragment>
            <div className={styles.tableListForm}>
              { this.renderForm() }
            </div>
            <StandardTable
              rowKey="bookCode"
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
