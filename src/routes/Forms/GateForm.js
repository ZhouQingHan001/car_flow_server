import React, {Component} from 'react';
import { Form, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, AutoComplete } from 'antd';
import { Button, Input, Modal, Popconfirm, Table} from 'antd';
import {connect} from 'dva';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

const FormItem = Form.Item;

const EditableCell = ({editable, value, onChange}) => (
  <div>
    {editable
      ? <Input style={{margin: '-5px 0'}} value={value} onChange={e => onChange(e.target.value)}/>
      : value
    }
  </div>
);
@connect((state) => ({
  visible: state.device.visible,
  loading: state.device.loading,
  data: state.device.gateList,
  userName: state.login.userName,
}))
@Form.create()
export default class GateForm extends Component {
  constructor(props) {
    super(props);
    if (this.props.userName === null) {
      this.props.dispatch({
        type: 'login/invalidLogin'
      })
    }
    this.columns = [{
      title: '网关号',
      dataIndex: 'cross_id',
      key: 1,
      render: (text, record) => this.renderColumns(text, record, 'cross_id'),
    }, {
      title: '道路名称',
      dataIndex: 'road_name',
      key: 2,
      render: (text, record) => this.renderColumns(text, record, 'road_name'),
    },
      {
        title: '纬度',
        dataIndex: 'latitude',
        key: 3,
        render: (text, record) => this.renderColumns(text, record, 'latitude'),
      },
      {
        title: '经度',
        dataIndex: 'longitude',
        key: 4,
        render: (text, record) => this.renderColumns(text, record, 'longitude'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 5,
        render: (text, record) => {
          const {editable} = record;
          return (
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                  <a onClick={() => this.save(record.cross_id)}>保存</a>
                  <span style={{marginRight: 5, marginLeft: 5}}>|</span>
                  <Popconfirm title="确定取消?" onConfirm={() => this.cancel(record.cross_id)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                  : <span><a onClick={() => this.edit(record.cross_id)} style={{marginRight:10}}>编辑</a>
                  <Popconfirm title="确定删除？" onConfirm={() => this.deleteGate(record.cross_id)}>
                    <Button type = 'danger'>
                      删除
                    </Button>
                  </Popconfirm>
                  </span>
              }
            </div>
          );
        },
      }];
    //初始化 列表 data
    this.props.dispatch({
      type: 'device/getGateList'
    });

  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.cross_id, column)}
      />
    );
  }

  handleChange(value, key, column) {

    this.props.dispatch({
      type: 'device/onHandleGateChange',
      payload: {value: value, cross_id: key, column: column}
    })

  }

  edit(key) {

    this.props.dispatch({
      type: 'device/editGateList',
      payload: key
    })
  }

  save(key) {
    const newData = this.props.data;
    this.props.dispatch({
      type: 'device/saveGateList',
      payload: {cross_id: key, newData: newData}
    });

  }

  deleteGate(cross_id) {
    this.props.dispatch({
      type:'device/deleteGate',
      payload: cross_id
    })
  }

  cancel(key) {
    this.props.dispatch({
      type: 'device/cancelGateList',
      payload: key
    })
  }

  showModal = () => {
    this.props.dispatch({
      type:'device/changeGateFormVisibility',
      payload: true
    })
  };

  handleOk = () => {

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        this.props.dispatch({
          type: 'device/submitGateForm',
          payload: values,
        });

        this.setState({loading: false, visible: false});
      }
    });

  };

  handleCancel = () => {
    this.props.dispatch({
      type:'device/changeGateFormVisibility',
      payload: false
    })
  };

  render() {
    const {loading, visible } = this.props;
    const { getFieldDecorator } = this.props.form;

      return (
        <div>
          <Button style={{marginBottom: 20}} type="primary" onClick={this.showModal}>
            添加新的设备
          </Button>
          <Modal
            visible={visible}
            title="添加新的网关"
            onCancel={this.handleCancel}
            footer={[
              <FormItem>
              <Button key="back" onClick={this.handleCancel}>返回</Button>,
              <Button key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleOk}>
                提交
              </Button>
              </FormItem>
            ]}
          >
              <Form
                onSubmit={this.handleSubmit}
                hideRequiredMark
              >

                <div style={{marginBottom: 50}}>
                  <FormItem
                    {...formItemLayout}
                    label="网关号"
                  >
                    {getFieldDecorator('cross_id', {
                      rules: [{
                        required: true, message: '请输入网关号',
                      }],
                    })(
                      <Input >

                      </Input>
                    )}
                  </FormItem>

                  <FormItem
                    label="车道名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('road_name', {
                      rules: [{
                        required: true, message: '请输入车道名称',
                      }],
                    })(
                      <Input>
                      </Input>
                    )}
                  </FormItem>

                  <FormItem
                    label="经度"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('longitude', {
                      rules: [{
                        required: true, message: '请选择经度',
                      }],
                    })(
                      <Input>
                      </Input>
                    )}
                  </FormItem>

                  <FormItem
                    label="纬度"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('latitude', {
                      rules: [{
                        required: true, message: '请选择纬度',
                      }],
                    })(
                      <Input>
                      </Input>
                    )}
                  </FormItem>
                </div>
              </Form>
          </Modal>
          <Table loading={loading} rowKey="uid" bordered dataSource={this.props.data}
                 columns={this.columns}/>
        </div>
      )
    }

}
