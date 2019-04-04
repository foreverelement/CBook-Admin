import React, { Component, PureComponent, Fragment, memo } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Card,
  Badge,
  Menu,
  Divider,
  List,
  Avatar,
  Dropdown,
  Icon,
  Modal,
  notification
} from 'antd'
import Barcode from 'react-barcode'
import ReactToPrint from 'react-to-print'
import DescriptionList from '@/components/DescriptionList'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import styles from './Detail.less'
import printIcon from '@/assets/print_icon.png'

const { Item: FormItem } = Form
const { TextArea } = Input
const { Option } = Select
const { Description } = DescriptionList
const orderStatusMap = {
  1000: {
    text: '平台审核',
    style: 'processing'
  },
  2001: {
    text: '审核失败',
    style: 'error'
  },
  2002: {
    text: '用户取消',
    style: 'warning'
  },
  1001: {
    text: '物流取件',
    style: 'processing'
  },
  2003: {
    text: '取件失败',
    style: 'error'
  },
  1002: {
    text: '验收书籍',
    style: 'processing'
  },
  1003: {
    text: '书费到账',
    style: 'success'
  }
}
const BOOK_STATUS_MAP = {
  1000: '待审核',
  1001: '审核通过',
  2001: '审核不通过',
  1002: '书费到账'
}

const getOrderStatusList = () =>
  Object.keys(orderStatusMap).map(status => ({
    text: orderStatusMap[status].text,
    value: +status
  }))

const toFixed = val => (typeof val === 'number' ? val.toFixed(2) : val)

@Form.create()
class RejectForm extends PureComponent {
  state = {
    fileList: [],
    loading: false
  }

  handleDenyUpdate = fieldsValue => {
    const { handleDeny } = this.props
    const { fileList } = this.state
    const formData = new FormData()
    const { file, ...restFields } = fieldsValue
    Object.keys(restFields).forEach(key => {
      formData.append(key, fieldsValue[key])
    })
    if (fileList.length > 0) {
      formData.append('file', fileList[0])
    }
    return handleDeny(formData)
  }

  render() {
    const { visible, form, handleReject, isDeny, handleModalVisible } = this.props
    const { fileList, loading } = this.state
    const resetForm = () => {
      form.resetFields()
      this.setState({ fileList: [], loading: false })
      handleModalVisible(false)
    }
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return
        this.setState({
          loading: true
        })
        if (isDeny) {
          this.handleDenyUpdate(fieldsValue).then(() => {
            resetForm()
          })
        } else {
          handleReject(fieldsValue).then(() => {
            resetForm()
          })
        }
      })
    }

    const uploadProps = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          if (!newFileList.length) {
            form.setFields({
              file: {
                value: null
              }
            })
          }
          return {
            fileList: newFileList
          }
        })
      },
      beforeUpload: file => {
        // eslint-disable-next-line
        this.setState(state => ({
          fileList: [file]
        }))
        return false
      },
      fileList,
      accept: '.jpg,.JPG,.jpeg,.JPEG,.png,.gif,.bmp,.apng,.webp'
    }
    return (
      <Modal
        destroyOnClose
        title="填写原因"
        width={450}
        visible={visible}
        onOk={okHandle}
        confirmLoading={loading}
        onCancel={() => resetForm()}
      >
        <FormItem key="reason">
          {form.getFieldDecorator('reason', {
            rules: [{ required: true, message: '拒收原因不能为空！' }]
          })(<TextArea rows={4} placeholder="请填写拒收原因" />)}
        </FormItem>
        {isDeny && (
          <FormItem key="file">
            {form.getFieldDecorator('file', {
              rules: [{ required: true, message: '请上传图片！' }]
            })(
              <Upload {...uploadProps}>
                <Button icon="upload">上传图片</Button>
              </Upload>
            )}
          </FormItem>
        )}
      </Modal>
    )
  }
}

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

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
    this.bookStatusList = Object.keys(BOOK_STATUS_MAP).map(key => ({
      key: Number(key),
      text: BOOK_STATUS_MAP[key]
    }))
  }

  render() {
    const { loading } = this.state
    const { visible, form, handleUpdate, handleModalVisible, data } = this.props
    const resetForm = () => {
      form.resetFields()
      this.setState({ loading: false })
      handleModalVisible(false)
    }
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return
        this.setState({ loading: true })
        handleUpdate(fieldsValue).then(() => {
          resetForm()
        })
      })
    }
    return (
      <Modal
        destroyOnClose
        title="修改内容"
        visible={visible}
        confirmLoading={loading}
        onOk={okHandle}
        onCancel={() => handleModalVisible(false)}
      >
        <FormItem key="name" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="书名">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '书名不能为空！' }],
            initialValue: data.name
          })(<Input placeholder="请填写" />)}
        </FormItem>
        <FormItem
          key="expectIncome"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="预计价格"
        >
          {form.getFieldDecorator('expectIncome', {
            rules: [{ required: true, message: '书名不能为空！' }],
            initialValue: data.expectIncome
          })(<InputNumber min={0} placeholder="请填写" />)}
        </FormItem>
        <FormItem
          key="bookStatus"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="图书状态"
        >
          {form.getFieldDecorator('bookStatus', {
            initialValue: data.bookStatus
          })(
            <Select placeholder="请选择" style={{ width: '120px' }}>
              {this.bookStatusList.map(item => (
                <Option value={item.key} key={item.key}>
                  {item.text}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Modal>
    )
  }
}

const BarcodeForm = memo(props => {
  let prentContent = null
  let printRef = null
  const { visible, handleModalVisible, value } = props
  const handlePrint = () => {
    if (printRef) {
      printRef.handlePrint()
    }
  }
  return (
    value && (
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
          bodyClass={styles.printBody}
          ref={el => {
            printRef = el
          }}
        />
        <div
          className={styles.printWrapper}
          ref={el => {
            prentContent = el
          }}
        >
          <Barcode font="Arial" value={value} />
          <div className={styles.printFooter}>
            <img src={printIcon} alt="" />
            <div className={styles.printFooterText}>
              <p>
                关注：<strong>"星月童书绘本"</strong>
              </p>{' '}
              {/*eslint-disable-line*/}
              <p>公众号获取更多信息</p>
            </div>
          </div>
        </div>
      </Modal>
    )
  )
})

const ListItemDesc = ({ author, press, expectIncome, actualIncome, bookStatus }) => (
  <Fragment>
    <div className={styles.descItem}>作者：{author}</div>
    <div className={styles.descItem}>出版社：{press}</div>
    <div className={styles.descItem}>预计价格：￥{toFixed(expectIncome)}</div>
    <div className={styles.descItem}>实际价格：￥{toFixed(actualIncome)}</div>
    <div className={styles.descItem}>图书状态：{BOOK_STATUS_MAP[bookStatus]}</div>
  </Fragment>
)

const MoreBtn = props => (
  <Dropdown
    trigger={['hover', 'click']}
    overlay={
      <Menu onClick={({ key }) => props.onClick(key, props.current, props.index)}>
        <Menu.Item key="edit">修改内容</Menu.Item>
        <Menu.Item key="mark">此书异常</Menu.Item>
      </Menu>
    }
  >
    <a>
      更多 <Icon type="down" />
    </a>
  </Dropdown>
)

/* eslint react/no-multi-comp:0 */
@connect(({ recycleDetail, loading }) => ({
  recycleDetail,
  loading: loading.effects['recycleDetail/fetch']
}))
class RecycleDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      orderStatusModalVisible: false,
      printModalVisible: false,
      bookAllPassed: false,
      isDeny: false,
      selectRow: {}
    }

    this.orderCode = null
    this.bookIndex = null
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

  setOrderStatus() {
    this.setState({
      bookAllPassed: this.checkOrderStatus(1002) // 检测是否是验收书籍状态
    })
  }

  handleModalVisible = bool => {
    this.setState({
      modalVisible: bool
    })
  }

  handleOrderStatusModalVisible = bool => {
    this.setState({
      orderStatusModalVisible: bool
    })
  }

  handleUpdateModalVisible = bool => {
    this.setState({
      updateModalVisible: bool
    })
  }

  handlePrintModalVisible = bool => {
    this.setState({
      printModalVisible: bool
    })
  }

  handleReject = fields => {
    return this.updateOrder({ ...fields, orderCode: this.orderCode, status: 2001 }) // 审核不通过
  }

  handleDeny = fields => {
    const { selectRow } = this.state
    fields.append('orderCode', this.orderCode)
    fields.append('bookCode', selectRow.bookCode)
    return this.updateOrder(fields, true) // 拒收图书
  }

  doReject = isDeny => {
    this.setState({ isDeny })
    this.handleModalVisible(true)
  }

  handleUpdate = fields => {
    const {
      recycleDetail: { order }
    } = this.props
    const { bookInfos, orderStatus: status } = order
    const newBookInfos = bookInfos.map((bookInfo, i) => {
      if (i === this.bookIndex) {
        return { ...bookInfo, ...fields }
      }
      return bookInfo
    })
    return this.updateOrder(
      { bookList: newBookInfos, orderCode: this.orderCode, status },
      false,
      true
    )
  }

  handleOrderStatusUpdate = fields => {
    return this.updateOrderStatus(fields.orderStatus)
  }

  handleBookItem = (key, currentItem, index) => {
    this.bookIndex = index
    this.setState({ selectRow: currentItem }, () => {
      switch (key) {
        case 'edit':
          this.handleUpdateModalVisible(true)
          break
        case 'mark':
          this.doReject(true)
          break
        default:
      }
    })
  }

  handlePrint(currentItem) {
    this.setState({ selectRow: currentItem }, () => {
      this.handlePrintModalVisible(true)
    })
  }

  updateOrderStatus(status) {
    const {
      recycleDetail: { order }
    } = this.props
    const { bookInfos } = order
    return this.updateOrder({ bookList: bookInfos, orderCode: this.orderCode, status })
  }

  checkOrderStatus(status) {
    const {
      recycleDetail: { order }
    } = this.props
    const isAllPassed = order.bookInfos.every(book => book.bookStatus === 1001)
    return isAllPassed && order.orderStatus === status
  }

  fetchOrder(orderCode) {
    const { dispatch } = this.props

    return dispatch({
      type: 'recycleDetail/fetch',
      payload: {
        orderCode
      },
      callback: () => {
        this.setOrderStatus() // 订单状态设置
      }
    })
  }

  handleOrder(actionType) {
    Modal.confirm({
      title: '提示信息',
      content: '确定要执行此操作吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let status
        if (actionType === 'check') {
          // 审核通过
          status = 1001
        } else if (actionType === 'payment') {
          // 书费到账
          status = 1003
        }
        this.updateOrder({
          orderCode: this.orderCode,
          status
        })
      }
    })
  }

  updateOrder(payload, isDeny, autoCheck) {
    const { dispatch } = this.props
    return dispatch({
      type: 'recycleDetail/update',
      payload,
      isDeny,
      callback: () => {
        this.fetchOrder(this.orderCode).then(() => {
          if (autoCheck && this.checkOrderStatus(1001)) {
            // 检测是否是物流取件状态
            this.updateOrderStatus(1002) // 验收书籍
          }
        })
        notification.success({
          message: '提示信息',
          description: '更新成功！'
        })
      }
    })
  }

  render() {
    const {
      recycleDetail: { order },
      loading
    } = this.props

    const {
      modalVisible,
      updateModalVisible,
      orderStatusModalVisible,
      printModalVisible,
      selectRow,
      isDeny,
      bookAllPassed
    } = this.state
    const updateOrderStatusMethods = {
      handleUpdate: this.handleOrderStatusUpdate,
      handleModalVisible: this.handleOrderStatusModalVisible
    }
    const parentMethods = {
      handleReject: this.handleReject,
      handleDeny: this.handleDeny,
      handleModalVisible: this.handleModalVisible
    }
    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleUpdateModalVisible
    }
    const printMethods = {
      handleModalVisible: this.handlePrintModalVisible
    }

    let orderActions = null

    // if (order.orderStatus === 1000) {
    //   orderActions = (
    //     <Fragment>
    //       <Button type="primary" icon="check-circle" onClick={() => this.handleOrder('check')}>
    //         验收订单并快递下单
    //       </Button>
    //       <Button type="danger" icon="close-circle" onClick={() => this.doReject(false)}>
    //         验收不通过
    //       </Button>
    //     </Fragment>
    //   );
    // }

    if (bookAllPassed) {
      orderActions = (
        <Button type="primary" icon="check-circle" onClick={() => this.handleOrder('payment')}>
          验收书籍并交付书费
        </Button>
      )
    }

    return (
      <PageHeaderWrapper title="回收订单详情页" action={orderActions}>
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
              {order.orderStatus && (
                <Fragment>
                  <Badge
                    status={orderStatusMap[order.orderStatus].style}
                    text={orderStatusMap[order.orderStatus].text}
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
                </Fragment>
              )}
            </Description>
            <Description term="预计收入">￥{toFixed(order.expectIncome)}</Description>
            <Description term="实际收入">￥{toFixed(order.actualIncome)}</Description>
            <Description term="揽件时间">{order.appointment}</Description>
            <Description term="下单时间">{order.createTime}</Description>
            <Description term="揽件地址">
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
            renderItem={(item, index) => (
              <List.Item
                className={styles.listItem}
                actions={[
                  <a onClick={() => this.handlePrint(item)}>打印条码</a>,
                  <MoreBtn current={item} index={index} onClick={this.handleBookItem} />
                ]}
              >
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
        <RejectForm {...parentMethods} isDeny={isDeny} visible={modalVisible} />
        <UpdateForm data={selectRow} {...updateMethods} visible={updateModalVisible} />
        <BarcodeForm {...printMethods} value={selectRow.bookCode} visible={printModalVisible} />
      </PageHeaderWrapper>
    )
  }
}

export default RecycleDetail
