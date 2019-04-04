import React, { Component, PureComponent, Fragment, memo } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import {
  Form,
  Select,
  Button,
  Card,
  Badge,
  Divider,
  List,
  Avatar,
  Icon,
  Modal,
  notification
} from 'antd'
import ReactToPrint from 'react-to-print'
import DescriptionList from '@/components/DescriptionList'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import BuyOrderExpressPrintTpl from '@/components/BuyOrderExpressPrintTpl'
import styles from './Detail.less'

const { Item: FormItem } = Form
const { Option } = Select
const { Description } = DescriptionList
const orderStatusMap = {
  1000: { text: '待付款', style: 'processing' },
  1001: { text: '付款完成，待发货', style: 'processing' },
  1002: { text: '物流发货', style: 'processing' },
  1003: { text: '订单完成', style: 'success' },
  2000: { text: '订单取消', style: 'warning' },
  2001: { text: '超时订单关闭', style: 'error' }
}
const BOOK_STATUS_MAP = {
  1000: '待审核',
  1001: '审核通过',
  2001: '审核不通过'
}

const getOrderStatus = key => orderStatusMap[key] || {}

const getOrderStatusList = () =>
  Object.keys(orderStatusMap).map(status => ({
    text: orderStatusMap[status].text,
    value: +status
  }))

const toFixed = val => (typeof val === 'number' ? val.toFixed(2) : val)

@Form.create()
class UpdateOrderStatusForm extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
    this.orderStatusList = getOrderStatusList()
  }

  render() {
    const { loading } = this.state
    const { visible, form, handleUpdate, handleModalVisible, data } = this.props
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return
        this.setState({ loading: true })
        handleUpdate(fieldsValue).then(() => {
          this.setState({ loading: false })
          handleModalVisible(false)
        })
      })
    }
    return (
      <Modal
        destroyOnClose
        title="修改订单状态"
        visible={visible}
        width={400}
        confirmLoading={loading}
        onOk={okHandle}
        onCancel={() => handleModalVisible(false)}
      >
        <FormItem key="orderStatus" className="nowrap" label="订单状态" labelCol={{ offset: 3 }}>
          {form.getFieldDecorator('orderStatus', {
            initialValue: data.orderStatus
          })(
            <Select placeholder="请选择" style={{ width: '180px' }}>
              {this.orderStatusList.map(status => (
                <Option key={status.value} value={status.value}>
                  {status.text}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Modal>
    )
  }
}

const ExpressForm = memo(props => {
  let prentContent = null
  let printRef = null
  const { visible, handleModalVisible, express } = props
  const handlePrint = () => {
    if (printRef) {
      printRef.handlePrint()
    }
  }
  return (
    <Modal
      destroyOnClose
      title="打印条码"
      visible={visible}
      bodyStyle={{ textAlign: 'center' }}
      okText="打印"
      onOk={handlePrint}
      onCancel={() => handleModalVisible(false)}
    >
      <ReactToPrint
        trigger={() => <Fragment />}
        content={() => prentContent}
        ref={el => {
          printRef = el
        }}
      />
      <div
        ref={el => {
          prentContent = el
        }}
      >
        <BuyOrderExpressPrintTpl data={express} />
      </div>
    </Modal>
  )
})

const ListItemDesc = ({ author, press, price, bookStatus }) => (
  <Fragment>
    <div className={styles.descItem}>作者：{author}</div>
    <div className={styles.descItem}>出版社：{press}</div>
    <div className={styles.descItem}>价格：￥{toFixed(price)}</div>
    <div className={styles.descItem}>图书状态：{BOOK_STATUS_MAP[bookStatus]}</div>
  </Fragment>
)

/* eslint react/no-multi-comp:0 */
@connect(({ buyDetail, loading }) => ({
  buyDetail,
  loading: loading.effects['buyDetail/fetch'],
  printLoading: loading.effects['buyDetail/fetchPrintData']
}))
class buyDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orderStatusModalVisible: false,
      printModalVisible: false
    }

    this.orderCode = null
  }

  componentDidMount() {
    const {
      match: {
        params: { orderCode }
      }
    } = this.props

    this.orderCode = orderCode
    this.fetchOrder(this.orderCode)
  }

  handleOrderStatusModalVisible = bool => {
    this.setState({
      orderStatusModalVisible: bool
    })
  }

  handlePrintModalVisible = bool => {
    this.setState({
      printModalVisible: bool
    })
  }

  handleOrderStatusUpdate = fields => {
    return this.updateOrderStatus(fields.orderStatus)
  }

  updateOrderStatus(status) {
    return this.updateOrder({ orderCode: this.orderCode, status })
  }

  fetchOrder(orderCode) {
    const { dispatch } = this.props

    return dispatch({
      type: 'buyDetail/fetch',
      payload: {
        orderCode
      }
    })
  }

  updateOrder(payload) {
    const { dispatch } = this.props
    return dispatch({
      type: 'buyDetail/update',
      payload,
      callback: () => {
        notification.success({
          message: '提示信息',
          description: '更新成功！'
        })
      }
    })
  }

  handlePrint() {
    const { dispatch } = this.props
    return dispatch({
      type: 'buyDetail/fetchPrintData',
      payload: {
        orderCode: this.orderCode
      },
      callback: () => {
        this.handlePrintModalVisible(true)
      }
    })
  }

  render() {
    const {
      buyDetail: { order, express },
      loading,
      printLoading
    } = this.props

    const { orderStatusModalVisible, printModalVisible } = this.state
    const updateOrderStatusMethods = {
      handleUpdate: this.handleOrderStatusUpdate,
      handleModalVisible: this.handleOrderStatusModalVisible
    }
    const printMethods = {
      handleModalVisible: this.handlePrintModalVisible
    }

    return (
      <PageHeaderWrapper title="订单详情页">
        <Card bordered={false}>
          <a className={styles.topNav} onClick={router.goBack}>
            <Icon type="left" />
            返回订单列表
          </a>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="订单号">{order.orderCode}</Description>
            <Description term="下单人">{order.orderName}</Description>
            <Description term="手机号">{order.orderMobile}</Description>
            <Description term="订单状态">
              {order.orderStatus !== undefined && (
                <Fragment>
                  <Badge
                    status={getOrderStatus(order.orderStatus).style}
                    text={getOrderStatus(order.orderStatus).text}
                    style={{ marginBottom: 3, marginRight: 8 }}
                  />
                  <Button
                    type="primary"
                    size="small"
                    ghost
                    onClick={() => {
                      this.handleOrderStatusModalVisible(true)
                    }}
                  >
                    修改状态
                  </Button>
                  {order.orderStatus === 1002 && (
                    <Button
                      type="primary"
                      size="small"
                      ghost
                      style={{
                        marginLeft: 8
                      }}
                      loading={printLoading}
                      onClick={() => {
                        this.handlePrint()
                      }}
                    >
                      打印快递面单
                    </Button>
                  )}
                </Fragment>
              )}
            </Description>
            <Description term="订单价格">￥{toFixed(order.total)}</Description>
            <Description term="原价">￥{toFixed(order.original)}</Description>
            <Description term="运费">￥{toFixed(order.carriage)}</Description>
            <Description term="扣减">￥{toFixed(order.deduction)}</Description>
            <Description term="折扣">{toFixed(order.discount)}</Description>
            <Description term="下单时间">{order.createTime}</Description>
            <Description term="寄件地址">
              {order.orderProvince
                ? `${order.orderProvince}${order.orderCity}${order.orderRegion}${
                    order.orderAddress
                  }`
                : ''}
            </Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>订单商品</div>
          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={false}
            dataSource={order.bookInfos}
            renderItem={item => (
              <List.Item className={styles.listItem}>
                <List.Item.Meta
                  avatar={<Avatar src={item.smallIcon} shape="square" size={100} />}
                  title={item.name}
                  description={<ListItemDesc {...item} />}
                />
              </List.Item>
            )}
          />
        </Card>
        <UpdateOrderStatusForm
          data={order}
          {...updateOrderStatusMethods}
          visible={orderStatusModalVisible}
        />
        <ExpressForm {...printMethods} express={express} visible={printModalVisible} />
      </PageHeaderWrapper>
    )
  }
}

export default buyDetail
