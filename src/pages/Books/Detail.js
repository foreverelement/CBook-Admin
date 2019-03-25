import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Card,
  Icon,
  Modal,
  Spin,
  notification,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Detail.less';

const { Item: FormItem } = Form;
const { Description } = DescriptionList;

const toFixed = val => typeof val === 'number' ? val.toFixed(2) : val;

@Form.create()
class UpdateForm extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      loading: false,
    }
  }

  render() {
    const { loading } = this.state;
    const { visible, form, handleUpdate, handleModalVisible, data } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        this.setState({ loading: true });
        handleUpdate(fieldsValue).then(() => {
          this.setState({ loading: false });
          handleModalVisible(false);
        });
      });
    };
    return (
      <Modal
        destroyOnClose
        title="修改图书信息"
        visible={visible}
        confirmLoading={loading}
        onOk={okHandle}
        onCancel={() => handleModalVisible(false)}
      >
        <FormItem key="name" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="书名">
          {form.getFieldDecorator('name', {
            initialValue: data.name,
          })(<Input placeholder="请填写" />)}
        </FormItem>
        <FormItem key="author" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="作者">
          {form.getFieldDecorator('author', {
            initialValue: data.author,
          })(<Input placeholder="请填写" />)}
        </FormItem>
        <FormItem key="press" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="出版社">
          {form.getFieldDecorator('press', {
            initialValue: data.press,
          })(<Input placeholder="请填写" />)}
        </FormItem>
        <FormItem
          key="sellPrice"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="售卖价格"
        >
          {form.getFieldDecorator('sellPrice', {
            initialValue: data.sellPrice,
          })(<InputNumber min={0} placeholder="请填写" />)}
        </FormItem>
        <FormItem
          key="starPrice"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="星币价格"
        >
          {form.getFieldDecorator('starPrice', {
            initialValue: data.starPrice,
          })(<InputNumber min={0} placeholder="请填写" />)}
        </FormItem>
        <FormItem
          key="publishDate"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="发行日期"
        >
          {form.getFieldDecorator('publishDate', {
            initialValue: moment(data.publishDate, 'YYYY-MM-DD'),
          })(<DatePicker />)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ bookDetail, loading }) => ({
  bookDetail,
  loading: loading.effects['bookDetail/fetch']
}))
class BookDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updateModalVisible: false,
    };

    this.bookCode = null;
  }

  componentDidMount() {
    const {
      match: {
        params: { bookCode },
      },
    } = this.props;

    this.bookCode = bookCode;
    this.fetchOrder(this.bookCode);
  }

  handleUpdateModalVisible = bool => {
    this.setState({
      updateModalVisible: bool,
    });
  };

  handleUpdate = fields => {
    return this.updateOrder({
      ...fields,
      publishDate: fields.publishDate.format('YYYY-MM-DD'),
      bookCode: this.bookCode
    });
  };

  fetchOrder(bookCode) {
    const { dispatch } = this.props;

    return dispatch({
      type: 'bookDetail/fetch',
      payload: {
        bookCode,
      }
    })
  }

  updateOrder(payload) {
    const { dispatch } = this.props;
    return dispatch({
      type: 'bookDetail/update',
      payload,
      callback: () => {
        notification.success({
          message: '提示信息',
          description: '更新成功！',
        });
      },
    });
  }

  render() {
    const {
      bookDetail: { data },
      loading
    } = this.props;

    const { updateModalVisible } = this.state;
    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleUpdateModalVisible,
    };

    return (
      <PageHeaderWrapper
        title="图书详情"
        action={
          <Button type="primary" onClick={() => this.handleUpdateModalVisible(true)}>
            修改书本信息
          </Button>
        }
      >
        <Card bordered={false}>
          <a className={styles.topNav} onClick={router.goBack}>
            <Icon type="left" />
            返回图书列表
          </a>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="图书名称">{data.name}</Description>
            <Description term="编码">{data.bookCode}</Description>
            <Description term="isbn">{data.isbn}</Description>
            <Description term="作者">{data.author}</Description>
            <Description term="出版社">{data.press}</Description>
            <Description term="价格">￥{toFixed(data.price)}</Description>
            <Description term="销售价格">￥{toFixed(data.sellPrice)}</Description>
            <Description term="星币价格">￥{toFixed(data.starPrice)}</Description>
            <Description term="发布时间">{data.publishDate}</Description>
          </DescriptionList>
          <Spin className={styles.spinner} spinning={loading} />
        </Card>
        <UpdateForm data={data} {...updateMethods} visible={updateModalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default BookDetail;
