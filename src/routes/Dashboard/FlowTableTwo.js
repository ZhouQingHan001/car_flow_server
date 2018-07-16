import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, DatePicker, Form, Select, Table} from 'antd';
import { routerRedux } from 'dva/router';
import {total} from "../../components/Charts/Pie/index";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;

const columns = [{
  title: '检测截止时间',
  dataIndex: 'DateTime',
  key: 'DateTime',
},
  {
    title: '车道号',
    dataIndex: 'LaneNo',
    key: 'LaneNo',
  },
  {
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
  flowState: state.flowTableTwo.flow,
  crossID: state.flowTableTwo.crossID,
  total: state.flowTableTwo.total_page,
  loading:state.flowTableTwo.loading,
  laneNo:state.flowTableTwo.laneNo,
  userName:state.login.userName,
  roadName:state.flowTableTwo.road.road_name || '未命名道路',
}))
@Form.create()
export default class FlowTableTwo extends Component {
  constructor(props) {
    super(props);

    if(this.props.userName === null){
       this.props.dispatch({
        type:'login/invalidLogin'
      })
    }

    this.onChangePage = this.onChangePage.bind(this);
    this.handleRoadName = this.handleRoadName.bind(this);
    // DatePicker
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
      currentPage:1
    };
    // 获取cross id
    this.props.dispatch({
      type: 'flowTableTwo/fetchCrossID',
    });

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        // Should format date value before submit.
        const rangeTimeValue = fieldsValue['range_time_picker'];
        const values = {
          ...fieldsValue,
          'range_time_picker': [
            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
          ],
        };

        console.log('Received values of form: ', values);
        values.time_start = values.range_time_picker[0];
        values.time_end = values.range_time_picker[1];
        values.currentPage = this.state.currentPage;

        this.props.dispatch({
          type: 'flowTableTwo/fetchFlowByRange',
          payload: values,
        });

        this.setState({
          values: values,
        });

      }
    });
  };
  handleRoadName(value){
    console.log(value);
    this.props.dispatch({
      type:'flowTableTwo/fetchRoadName',
      payload: value,
    });

    this.props.dispatch({
      type:'flowTableTwo/fetchLaneNo',
      payload:value
    });

  }
  onChangePage(pageNumber){
    this.state.values.currentPage = pageNumber;
    this.state.currentPage = pageNumber;
    this.props.dispatch({
      type: 'flowTableTwo/fetchFlowByRange',
      payload: this.state.values,
    });
  }

  // 处理表单提交
  render() {
    // 设置分页的思路
    let pageConfig = false;
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
        LaneNo:tempData.LaneNo,
        Volume: tempData.Volume,
        AvgOccupancy: tempData.AvgOccupancy,
        AvgHeadTime: tempData.AvgHeadTime,
        AvgLength: tempData.AvgLength,
        AvgSpeed: tempData.AvgSpeed,
      };
      dataSource.push(obj)
    });

    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
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
                <Select style={{width: 120}} onSelect = {this.handleRoadName} >
                  {crossOption}
                </Select>
              )}
            </FormItem>
            <FormItem
              label="开始车道号"
            >
              {getFieldDecorator('lane_start', {
                rules: [{
                  required: true, message: '请选择车道号',
                }],
              })(
                <Select style={{width: 120, marginRight: 20}} >
                  {laneOption}
                </Select>
              )}
            </FormItem>

            <FormItem
              label="结束车道号"
            >
              {getFieldDecorator('lane_end', {
                rules: [{
                  required: true, message: '请选择车道号',
                }],
              })(
                <Select style={{width: 120, marginRight: 20}}>
                  {laneOption}
                </Select>
              )}
            </FormItem>

            <FormItem>
              <FormItem
                label="时间段"
              >
                {getFieldDecorator('range_time_picker', rangeConfig)(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </FormItem>
            </FormItem>

            <FormItem>
              <Button style={{ marginRight: 20}} type="primary" htmlType="submit" loading={this.props.loading}>Search</Button>
            </FormItem>

          </div>
        </Form>
          <h3>{this.props.roadName}</h3>
        <Table
          pagination={{
          total: this.props.total,
          current: this.state.currentPage,
            onChange: (page) => {
             this.onChangePage(page)
            }
          }}
          columns={columns}
          dataSource={dataSource}
          loading = {this.props.loading}/>
        </PageHeaderLayout>
      </div>
    )
  }
}
