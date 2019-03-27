import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
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
  notification,
  Spin,
  Tag,
  Badge,
  Checkbox
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Grid from '@/components/Grid';
import styles from './Detail.less';

const { Item: FormItem } = Form;
const { CheckableTag } = Tag;
const { TextArea } = Input;
const { Description } = DescriptionList;

const toFixed = val => typeof val === 'number' ? val.toFixed(2) : val;

const tagTypes = ['课外阅读', '亲子关系', '历史文学'];
const languageTypes = ['中文', '中文注音', '英文', '中英文'];
const ageTypes = ['0-2岁', '3-5岁', '6-8岁', '8岁以上'];

class CheckTag extends PureComponent {
  constructor(props) {
    super(props);

    const { checked } = this.props;
    this.state = {
      checked
    };
  }

  handleChange = checked => {
    const { onChange, children } = this.props;
    this.setState({ checked });
    onChange(checked, children);
  };

  render() {
    const { checked } = this.state;
    return <CheckableTag {...this.props} checked={checked} onChange={this.handleChange} />;
  }
}

CheckTag.defaultProps = {
  onChange: () => {},
};

CheckTag.propTypes = {
  onChange: PropTypes.func,
};


@Form.create()
class UpdateForm extends Component {
  state = {
    loading: false,
    loaded: false,
    imags: [],
    tags: [],
    ageType: [],
    languageType: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { loaded, data: { imags, tags, ageType, languageType } } = props;
    if (loaded !== state.loaded) {
      return {
        loaded,
        imags,
        tags,
        ageType,
        languageType,
      };
    }
    return null;
  }

  getFinalFieldsValue(fieldsValue) {
    const { tags, ageType, languageType } = this.state;
    const imagGroup = [];

    // eslint-disable-next-line
    for (let key in fieldsValue) {
      if (/^imags[\d+]$/.test(key)) {
        if (fieldsValue[key]) {
          imagGroup.push(fieldsValue[key]);
        }
        delete fieldsValue[key]; // eslint-disable-line
      }
    }
    Object.assign(fieldsValue, {
      imags: imagGroup.join('|'),
      tags,
      ageType,
      languageType,
      publishDate: fieldsValue.publishDate.format('YYYY-MM-DD'),
    });
    return fieldsValue;
  }

  handleTagChange = (checked, text) => {
    const { tags } = this.state;
    if (checked) {
      this.setState({
        tags: [...tags, text]
      })
    } else {
      this.setState({
        tags: tags.filter(item => item !== text)
      })
    }
  };

  handleLangChange = (checked, text) => {
    const { languageType } = this.state;
    if (checked) {
      this.setState({
        languageType: [...languageType, text]
      })
    } else {
      this.setState({
        languageType: languageType.filter(item => item !== text)
      })
    }
  };

  handleAgeChange = (checked, text) => {
    const { ageType } = this.state;
    if (checked) {
      this.setState({
        ageType: [...ageType, text]
      })
    } else {
      this.setState({
        ageType: ageType.filter(item => item !== text)
      })
    }
  };

  handleReduce(index) {
    const { imags } = this.state;
    this.setState({
      imags: imags.filter((item, i) => index !== i),
    })
  }

  handleAdd() {
    const { imags } = this.state;
    this.setState({
      imags: [...imags, ''],
    })
  }

  handleReset() {
    this.setState({
      loaded: false,
    })
  }

  handleSubmit() {
    const { form, handleUpdate, handleModalVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newFieldsValue = this.getFinalFieldsValue(fieldsValue);
      this.setState({ loading: true });
      handleUpdate(newFieldsValue).then(() => {
        this.setState({ loading: false });
        handleModalVisible(false);
      })
    });
  }

  render() {
    const { loading, imags } = this.state;
    const { visible, form, handleModalVisible, data } = this.props;

    return (
      <Modal
        destroyOnClose
        title="修改商品信息"
        width={900}
        visible={visible}
        confirmLoading={loading}
        onOk={() => this.handleSubmit()}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => this.handleReset()}
      >
        <Grid col={6} gutter={0}>
          <Grid.Item>
            <FormItem
              key="name"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="书名"
            >
              {form.getFieldDecorator('name', {
                initialValue: data.name,
              })(<Input placeholder="请填写" />)}
            </FormItem>
          </Grid.Item>
          <Grid.Item>
            <FormItem
              key="costPrice"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="售卖价格"
            >
              {form.getFieldDecorator('costPrice', {
                initialValue: data.costPrice,
              })(<InputNumber min={0} placeholder="请填写" />)}
            </FormItem>
          </Grid.Item>
        </Grid>
        <Grid col={6} gutter={0}>
          <Grid.Item>
            <FormItem
              key="author"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="作者"
            >
              {form.getFieldDecorator('author', {
                initialValue: data.author,
              })(<Input placeholder="请填写" />)}
            </FormItem>
          </Grid.Item>
          <Grid.Item>
            <FormItem
              key="starPrice"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="星币价格"
            >
              {form.getFieldDecorator('starPrice', {
                initialValue: data.starPrice,
              })(<InputNumber min={0} placeholder="请填写" />)}
            </FormItem>
          </Grid.Item>
        </Grid>
        <Grid col={6} gutter={0}>
          <Grid.Item>
            <FormItem
              key="press"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="出版社"
            >
              {form.getFieldDecorator('press', {
                initialValue: data.press,
              })(<Input placeholder="请填写" />)}
            </FormItem>
          </Grid.Item>
          <Grid.Item>
            <FormItem
              key="doubanScore"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="豆瓣评分"
            >
              {form.getFieldDecorator('doubanScore', {
                initialValue: data.doubanScore,
              })(<InputNumber min={0} max={5} placeholder="请填写" />)}
            </FormItem>
          </Grid.Item>
        </Grid>
        <Grid col={6} gutter={0}>
          <Grid.Item>
            <FormItem
              key="smallImageUrl"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="商品图片"
            >
              {form.getFieldDecorator('smallImageUrl', {
                initialValue: data.smallImageUrl,
              })(<Input placeholder="请填写" />)}
            </FormItem>
          </Grid.Item>
          <Grid.Item>
            <FormItem
              key="publishDate"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="发行日期"
            >
              {form.getFieldDecorator('publishDate', {
                initialValue: moment(data.publishDate, 'YYYY-MM-DD'),
              })(<DatePicker />)}
            </FormItem>
          </Grid.Item>
        </Grid>
        {
          imags.map((item, i) =>
            <Grid col={6} gutter={0} key={`${item}${i}`}>
              <Grid.Item>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label={`插画${i+1}`}
                  className={styles.picFormItem}
                >
                  {
                    form.getFieldDecorator(`imags${i}`, {
                      initialValue: item,
                    })(<Input placeholder="请填写" />)
                  }
                  <span style={{marginLeft: 5}}>
                    {
                      i < imags.length - 1 ?
                        <Button shape="circle" size="small" icon="minus" style={{verticalAlign: 'text-bottom'}} onClick={() => this.handleReduce(i)} />
                        :
                        <Button shape="circle" size="small" icon="plus" style={{verticalAlign: 'text-bottom'}} onClick={() => this.handleAdd(i)} />
                    }
                  </span>
                </FormItem>
              </Grid.Item>
            </Grid>
          )
        }
        <Grid col={6} gutter={0}>
          <Grid.Item>
            <FormItem
              key="authorBrief"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="作者简介"
            >
              {form.getFieldDecorator('authorBrief', {
                initialValue: data.authorBrief,
              })(<TextArea style={{height: 120}} placeholder="请填写" />)}
            </FormItem>
          </Grid.Item>
          <Grid.Item>
            <FormItem
              key="contentBrief"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="内容简介"
            >
              {form.getFieldDecorator('contentBrief', {
                initialValue: data.contentBrief,
              })(<TextArea style={{height: 120}} placeholder="请填写" />)}
            </FormItem>
          </Grid.Item>
        </Grid>
        <Grid col={6} gutter={0}>
          <Grid.Item>
            <FormItem
              key="tags"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="标签分类"
            >
              {
                tagTypes.map(item =>
                  <CheckTag
                    checked={data.tags.includes(item)}
                    key={item}
                    onChange={this.handleTagChange}
                  >
                    {item}
                  </CheckTag>)
              }
            </FormItem>
          </Grid.Item>
        </Grid>
        <Grid col={6} gutter={0}>
          <Grid.Item>
            <FormItem
              key="ageType"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="年龄分类"
            >
              {
                ageTypes.map(item =>
                  <CheckTag
                    checked={data.ageType.includes(item)}
                    key={item}
                    onChange={this.handleAgeChange}
                  >
                    {item}
                  </CheckTag>)
              }
            </FormItem>
          </Grid.Item>
        </Grid>
        <Grid col={6} gutter={0}>
          <Grid.Item>
            <FormItem
              key="languageType"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="语言分类"
            >
              {
                languageTypes.map(item =>
                  <CheckTag
                    checked={data.languageType.includes(item)}
                    key={item}
                    onChange={this.handleLangChange}
                  >
                    {item}
                  </CheckTag>)
              }
            </FormItem>
          </Grid.Item>
        </Grid>
        <Grid col={6} gutter={0}>
          <Grid.Item>
            <FormItem
              key="status"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              style={{marginBottom: 0}}
              label="是否上架该商品"
            >
              {form.getFieldDecorator('status', {
                initialValue: data.status,
              })(<Checkbox defaultChecked={data.status} />)}
            </FormItem>
          </Grid.Item>
        </Grid>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ goodDetail, loading }) => ({
  goodDetail,
  loading: loading.effects['goodDetail/fetch']
}))
class GoodDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updateModalVisible: false,
    };

    this.goodsId = null;
  }

  componentDidMount() {
    const {
      match: {
        params: { goodsId },
      },
    } = this.props;

    this.goodsId = goodsId;
    this.fetchGood(this.goodsId);
  }

  handleUpdateModalVisible = bool => {
    this.setState({
      updateModalVisible: bool,
    });
  };

  handleUpdate = fields => {
    return this.updateGood({
      ...fields,
      goodsId: this.goodsId
    });
  };

  fetchGood(goodsId) {
    const { dispatch } = this.props;

    return dispatch({
      type: 'goodDetail/fetch',
      payload: {
        goodsId,
      }
    })
  }

  updateGood(payload) {
    const { dispatch } = this.props;
    return dispatch({
      type: 'goodDetail/update',
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
      goodDetail: { data },
      loading
    } = this.props;

    data.ageType = data.ageType || [];
    data.languageType = data.languageType || [];
    data.tags = data.tags || [];
    data.imags = data.imags || [];

    const { updateModalVisible } = this.state;
    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleUpdateModalVisible,
    };

    return (
      <PageHeaderWrapper
        title="商品详情"
        action={
          <Button type="primary" onClick={() => this.handleUpdateModalVisible(true)}>
            修改商品信息
          </Button>
        }
      >
        <Card bordered={false}>
          <a className={styles.topNav} onClick={router.goBack}>
            <Icon type="left" />
            返回商品列表
          </a>
          <DescriptionList size="large" style={{ marginBottom: 20 }}>
            <Description term="商品名称">{data.name}</Description>
            <Description term="商品ID">{data.goodsId}</Description>
            <Description term="isbn">{data.isbn}</Description>
            <Description term="作者">{data.author}</Description>
            <Description term="出版社">{data.press}</Description>
            <Description term="价格">￥{toFixed(data.price)}</Description>
            <Description term="售卖价格">￥{toFixed(data.costPrice)}</Description>
            <Description term="销量">￥{toFixed(data.sales)}</Description>
            <Description term="星币价格">￥{toFixed(data.starPrice)}</Description>
            <Description term="星币抵扣">￥{toFixed(data.starDeduction)}</Description>
            <Description term="库存">{data.stockNumber}</Description>
            <Description term="豆瓣评分">{data.doubanScore}</Description>
            <Description term="标签分类">
              {data.tags.map(item =>
                item && <Tag key={item}>{item}</Tag>
              )}
            </Description>
            <Description term="年龄分类">
              {data.ageType.map(item =>
                item && <Tag key={item}>{item}</Tag>
              )}
            </Description>
            <Description term="语言分类">
              {data.languageType.map(item =>
                item && <Tag key={item}>{item}</Tag>
              )}
            </Description>
            <Description term="发布时间">
              {data.publishDate}
            </Description>
            <Description term="上下架状态">
              <Badge
                status={data.status ? 'success' : 'warning'}
                text={data.status ? '已上架' : '已下架'}
              />
            </Description>
          </DescriptionList>
          <DescriptionList size="large" col={1} style={{ marginBottom: 32 }}>
            <Description term="作者简介" style={{marginBottom: 10}}>
              {data.authorBrief}
            </Description>
            <Description term="商品简介" style={{marginBottom: 10}}>
              {data.contentBrief}
            </Description>
            <Description term="商品图片" className={styles.break}>
              <img
                className={styles.smallImg}
                src={data.smallImageUrl}
                alt="商品图片"
                onClick={() => window.open(data.smallImageUrl)}
              />
            </Description>
            <Description term="插画" className={styles.break}>
              {
                data.imags.map((img, i) =>
                  img &&
                  <img
                    className={styles.imageItem}
                    key={`${img}${i}`}
                    src={img}
                    alt="商品插画"
                    onClick={() => window.open(img)}
                  />
                )
              }
            </Description>
          </DescriptionList>
          <Spin className={styles.spinner} spinning={loading} />
        </Card>
        <UpdateForm data={data} {...updateMethods} loaded={!loading} visible={updateModalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default GoodDetail;
