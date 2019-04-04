import React, { Fragment, memo, PureComponent } from 'react'
import { connect } from 'dva'
import { Row, Col, Card, Form, Input, Select, Button, Modal } from 'antd'
import Barcode from 'react-barcode'
import ReactToPrint from 'react-to-print'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'

import styles from './List.less'
import printIcon from '@/assets/print_icon.png'

const FormItem = Form.Item
const { Option } = Select
const filterMap = [
  {
    key: 'name',
    text: '名称'
  },
  {
    key: 'location',
    text: '位置'
  },
  {
    key: 'caseCode',
    text: 'caseCode'
  },
  {
    key: 'cellCode',
    text: 'cellCode'
  }
]

const showTableTotal = total => `共${total}条数据`
const PAGE_SIZE = 10

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
        </div>
      </Modal>
    )
  )
})

/* eslint react/no-multi-comp:0 */
@connect(({ bookStack, loading }) => ({
  bookStack,
  loading: loading.models.bookStack
}))
@Form.create()
class List extends PureComponent {
  state = {
    searchKey: '',
    searchValue: '',
    printCode: '',
    printModalVisible: false,
    offset: 1,
    limit: PAGE_SIZE
  }

  columns = [
    {
      title: 'id',
      dataIndex: 'id'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '位置',
      dataIndex: 'location'
    },
    {
      title: 'caseCode',
      dataIndex: 'caseCode',
      render: text => (
        <Fragment>
          <span>{text}</span>
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: 8 }}
            ghost
            onClick={() => this.handlePrintCode(text)}
          >
            打印
          </Button>
        </Fragment>
      )
    },
    {
      title: 'cellCode',
      dataIndex: 'cellCode',
      render: text => (
        <Fragment>
          <span>{text}</span>
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: 8 }}
            ghost
            onClick={() => this.handlePrintCode(text)}
          >
            打印
          </Button>
        </Fragment>
      )
    }
  ]

  componentDidMount() {
    this.handleRefresh()
  }

  handleSearch = e => {
    e.preventDefault()

    const { form } = this.props
    const formValues = form.getFieldsValue()
    const { searchKey, searchValue } = formValues
    this.fetchOrders(searchKey, searchValue, 1)
  }

  handleFormReset = () => {
    const { form } = this.props
    form.resetFields()
    this.fetchOrders('', '', 1)
  }

  handleRefresh = () => {
    const { searchKey, searchValue, offset } = this.state
    this.fetchOrders(searchKey, searchValue, offset)
  }

  handlePageChange = pagination => {
    const { searchKey, searchValue } = this.state
    this.fetchOrders(searchKey, searchValue, pagination)
  }

  handlePrintModalVisible = bool => {
    this.setState({
      printModalVisible: bool
    })
  }

  handlePrintCode(code) {
    this.setState(
      {
        printCode: code
      },
      () => {
        this.handlePrintModalVisible(true)
      }
    )
  }

  fetchOrders(searchKey, searchValue, offset) {
    const { dispatch } = this.props
    const { limit } = this.state

    this.setState({
      offset,
      searchKey,
      searchValue
    })
    dispatch({
      type: 'bookStack/fetch',
      payload: {
        offset,
        limit,
        filter: !searchKey && !searchValue ? [] : [{ key: searchKey, values: [searchValue] }]
      }
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator }
    } = this.props
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="搜索书盒" className="nowrap">
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
    )
  }

  render() {
    const {
      bookStack: { data },
      loading
    } = this.props

    const { printCode, printModalVisible } = this.state

    data.pagination = {
      ...data.pagination,
      defaultPageSize: PAGE_SIZE,
      showTotal: showTableTotal,
      onChange: this.handlePageChange,
      showSizeChanger: false
    }

    const printMethods = {
      handleModalVisible: this.handlePrintModalVisible
    }

    return (
      <PageHeaderWrapper title="书盒列表">
        <Card>
          <Fragment>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              rowKey="id"
              size="middle"
              selectedRows={[]}
              showAlert={false}
              rowSelection={null}
              scroll={{ x: 970 }}
              loading={loading}
              data={data}
              columns={this.columns}
            />
          </Fragment>
        </Card>
        <BarcodeForm {...printMethods} value={printCode} visible={printModalVisible} />
      </PageHeaderWrapper>
    )
  }
}

export default List
