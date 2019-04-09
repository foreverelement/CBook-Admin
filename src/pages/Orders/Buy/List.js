import React, { Fragment, PureComponent } from 'react'
import { connect } from 'dva'
// import Link from 'umi/link';
import router from 'umi/router'
import { Row, Col, Card, Form, Input, Select, Button, Badge } from 'antd'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'

import styles from './List.less'

const FormItem = Form.Item
const { Option } = Select
const orderStatusMap = {
  1000: { text: '待付款', style: 'processing' },
  1001: { text: '付款完成，待发货', style: 'processing' },
  1002: { text: '物流发货', style: 'processing' },
  1003: { text: '订单完成', style: 'success' },
  2000: { text: '订单取消', style: 'warning' },
  2001: { text: '超时订单关闭', style: 'error' }
}

const getOrderStatus = key => orderStatusMap[key] || {}

const columns = [
  {
    title: '订单号',
    dataIndex: 'orderCode'
  },
  {
    title: '下单人',
    dataIndex: 'orderName'
  },
  {
    title: '手机号',
    dataIndex: 'orderMobile'
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
    render(val) {
      return <Badge status={getOrderStatus(val).style} text={getOrderStatus(val).text} />
    }
  },
  {
    title: '订单价格',
    dataIndex: 'total',
    sorter: (a, b) => a.total - b.total,
    render(val) {
      return `￥${val.toFixed(2)}`
    }
  },
  {
    title: '下单时间',
    dataIndex: 'createTime'
  }
]

const getOrderStatusList = () =>
  Object.keys(orderStatusMap).map(status => ({
    text: orderStatusMap[status].text,
    value: +status
  }))

const showTableTotal = total => `共${total}条数据`
const PAGE_SIZE = 10

/* eslint react/no-multi-comp:0 */
@connect(({ buyOrder, loading }) => ({
  buyOrder,
  loading: loading.models.buyOrder
}))
@Form.create()
class List extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      orderCode: '',
      status: '',
      offset: 1,
      limit: PAGE_SIZE
    }

    this.orderStautsList = getOrderStatusList()
  }

  componentDidMount() {
    const { buyOrder: { formParams } } = this.props
    this.setState(formParams, () => {
      this.handleRefresh()
    })
  }

  handleSearch = e => {
    e.preventDefault()

    const { form } = this.props
    const formValues = form.getFieldsValue()
    const { orderCode, status } = formValues
    this.fetchOrders(orderCode, status, 1)
  }

  handleFormReset = () => {
    const { form } = this.props
    form.resetFields()
    this.fetchOrders('', '', 1)
  }

  handleRefresh = () => {
    const { orderCode, status, offset } = this.state
    this.fetchOrders(orderCode, status, offset)
  }

  handlePageChange = pagination => {
    const { orderCode, status } = this.state
    this.fetchOrders(orderCode, status, pagination)
  }

  handleRow = row => ({
    // eslint-disable-next-line
    onClick: event => {
      router.push(`/orders/buy/detail/${row.orderCode}`)
    }
  })

  fetchOrders(orderCode, status, offset) {
    const { dispatch } = this.props
    const { limit } = this.state

    if (orderCode || status) {
      let filter = []
      if (status) {
        filter = [{ key: 'orderStatus', values: [status] }]
      }
      const formParams = {
        orderCode,
        status,
        offset
      }
      this.setState(formParams)
      dispatch({
        type: 'buyOrder/searchOrders',
        payload: {
          orderCode,
          offset,
          limit,
          filter
        },
        formParams
      })
    } else {
      const formParams = {
        orderCode: '',
        status: '',
        offset
      }
      this.setState(formParams)
      dispatch({
        type: 'buyOrder/fetchOrders',
        payload: {
          offset,
          limit
        },
        formParams
      })
    }
  }

  renderForm() {
    const {
      form: { getFieldDecorator }
    } = this.props

    const { orderCode, status } = this.state

    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="搜索订单" className="nowrap">
              {getFieldDecorator('orderCode', {
                initialValue: orderCode
              })(<Input placeholder="请输入" allowClear />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态" className="nowrap">
              {getFieldDecorator('status', {
                initialValue: status
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="" key={0}>
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
    )
  }

  render() {
    const {
      buyOrder: { data },
      loading
    } = this.props

    data.pagination = {
      ...data.pagination,
      defaultPageSize: PAGE_SIZE,
      showTotal: showTableTotal,
      onChange: this.handlePageChange,
      showSizeChanger: false
    }

    return (
      <PageHeaderWrapper title="买书订单列表">
        <Card>
          <Fragment>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              rowKey="orderCode"
              size="middle"
              rowClassName={styles.orderTableRow}
              selectedRows={[]}
              showAlert={false}
              rowSelection={null}
              scroll={{ x: 970 }}
              loading={loading}
              data={data}
              columns={columns}
              onRow={this.handleRow}
            />
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default List
