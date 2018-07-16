import React, {Component} from 'react';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import {Button, Form, InputNumber, Select, Table} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


const Option = Select.Option;
const FormItem = Form.Item;

const columns = [{
  title: '检测截止时间',
  dataIndex: 'DateTime',
  key: 'DateTime',
}, {
  title: '交通流量（辆）',
  dataIndex: 'Volume',
  key: 'Volume',
}, {
  title: '平均占有时间（毫秒）',
  dataIndex: 'AvgOccupancy',
  key: 'AvgOccupancy',
},
  {
    title: '平均车头时距（毫秒）',
    dataIndex: 'AvgHeadTime',
    key: 'AvgHeadTime',

  },
  {
    title: '平均车长（米）',
    dataIndex: 'AvgLength',
    key: 'AvgLength',

  },
  {
    title: '平均速度（KM/H）',
    dataIndex: 'AvgSpeed',
    key: 'AvgSpeed',
  },
];


@connect((state) => ({
  flowState: state.flowTableOne.flow,
  crossID: state.flowTableOne.crossID,
  userName: state.login.userName,
  laneNo:state.flowTableOne.laneNo,
  roadName: state.flowTableOne.road.road_name || '未命名道路',
}))

@Form.create()
export default class FlowTableOne extends Component {
  constructor(props) {
    super(props);
    this.handleRoadName = this.handleRoadName.bind(this);
    if (this.props.userName === null) {
      this.props.dispatch({
        type: 'login/invalidLogin'
      })
    }

    this.props.dispatch({
      type: 'flowTableOne/fetchCrossID',
    });

  }

  handleRoadName(value) {
    this.props.dispatch({
      type: 'flowTableOne/fetchRoadName',
      payload: value,
    });

    this.props.dispatch({
      type:'flowTableOne/fetchLaneNo',
      payload:value
    });

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        this.props.dispatch({
          type: 'flowTableOne/fetchFlow',
          payload: values,
        });
      }
    });
  };

  // 处理表单提交
  render() {
    const {submitting} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    // 设置CrossID
    let crossIDs = this.props.crossID || [];
    let crossOption = <Option key={1}>数据请求中</Option>;
    let laneNO = [];

    if (crossIDs != 0) {
      crossOption = crossIDs.map(id => <Option key={id}>{id}</Option>);
    }
    const laneOption = this.props.laneNo.map(i => <Option key={i}>{i}</Option>);
    // 设置Table数据
    const dataSource = [];
    let orginalSource = this.props.flowState;
    orginalSource.forEach((v, i) => {
      let tempData = v.DataList.Data;
      let obj = {
        key: i,
        DateTime: v.DateTime,
        Volume: tempData.Volume,
        AvgOccupancy: tempData.AvgOccupancy,
        AvgHeadTime: tempData.AvgHeadTime,
        AvgLength: tempData.AvgLength,
        AvgSpeed: tempData.AvgSpeed,
      };
      dataSource.push(obj)
    });

    return (
      <div>
        <PageHeaderLayout title="车流量表格展示" content="">
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            layout="inline"
          >

            <div style={{marginBottom: 50}}>
              <FormItem
                label="Cross-ID"

              >
                {getFieldDecorator('cross_id', {
                  rules: [{
                    required: true, message: '请输入CrossID',
                  }],
                })(
                  <Select style={{width: 120}} onSelect={this.handleRoadName}>
                    {crossOption}
                  </Select>
                )}
              </FormItem>

              <FormItem
                label="车道号"
              >
                {getFieldDecorator('lane', {
                  rules: [{
                    required: true, message: '请选择车道号',
                  }],
                })(
                  <Select style={{width: 120, marginRight: 20}}>
                    {laneOption}
                  </Select>
                )}
              </FormItem>

              <FormItem
                label="查看最近"
              >
                {getFieldDecorator('last_minutes', {
                  rules: [{
                    required: true, message: '请选择',
                  }],
                })(
                  <InputNumber style={{marginLeft: 20}} max={1440} min={1} placeholder={'max 24h'}/>
                )}
                <span style={{marginLeft: 0, marginTop: 5}}>分钟的数据</span>
              </FormItem>
              <FormItem>
                <Button style={{marginLeft: 20, marginRight: 20}} type="primary" htmlType="submit"
                        loading={this.props.loading}>Search</Button>
              </FormItem>
            </div>
          </Form>
          <h3>{this.props.roadName}</h3>
          <Table columns={columns} dataSource={dataSource}/>
        </PageHeaderLayout>
      </div>
    )
  }
}


