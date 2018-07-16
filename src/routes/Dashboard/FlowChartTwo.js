import TimelineChart from '../../components/Charts/TimelineChart/index';
import React, {Component} from 'react';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import {Button, Form, InputNumber, Select, DatePicker} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const Option = Select.Option;
const FormItem = Form.Item;


@connect((state) => ({
  flowState: state.flowChartTwo.flow,
  crossID: state.flowChartTwo.crossID,
  userName: state.login.userName,
  loading:state.flowChartTwo.loading,
  laneNo:state.flowChartTwo.laneNo,
  roadName:state.flowChartTwo.road.road_name || '未命名道路',
}))

@Form.create()
export default class FlowChartOne extends Component {
  constructor(props) {
    super(props);
    this.handleParams = this.handleParams.bind(this);
    this.handleRoadName = this.handleRoadName.bind(this);
    this.onChange = this.onChange.bind(this);

    if (this.props.userName === null) {
      this.props.dispatch({
        type: 'login/invalidLogin'
      })
    }

    this.props.dispatch({
      type: 'flowChartTwo/fetchCrossID',
    });

    this.state = {
      chartData : [],
      unit:'单位'
    }

  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {flowState} = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.date = this.state.date;
      console.log(values);
      if (!err) {
        this.props.dispatch({
          type: 'flowChartTwo/fetchFlow',
          payload: values,
        });
        // 根据values.params 来判断应该显示的参数
        switch (values.params){
          case '交通流量':{
            const chartData = [];
            console.log(flowState.length);
            for (let i = 0; i < flowState.length; i++) {
              // '交通流量','平均速度','平均占用时间','平均车头时距','平均车长'
              chartData.push({
                x: this.formatDate(flowState)[i],
                y1: this.formatFlow(flowState)[i],
              });
            }
            console.log(chartData);
            this.setState({
              chartData:chartData,
              params:values.params,
            });
            break;
          }
          case '平均速度':{
            const chartData = [];
            for (let i = 0; i < flowState.length; i++) {
              // '交通流量','平均速度','平均占用时间','平均车头时距','平均车长'
              chartData.push({
                x: this.formatDate( flowState)[i],
                y1: this.formatSpeed(flowState)[i],
              });

            }
            this.setState({
              chartData:chartData,
              params:values.params,
            });
            break;
          }
          case '平均占用时间':{
            const chartData = [];
            for (let i = 0; i < flowState.length; i++) {
              // '交通流量','平均速度','平均占用时间','平均车头时距','平均车长'
              chartData.push({
                x: this.formatDate(flowState)[i],
                y1: this.formatAvgOccupancy(flowState)[i],
              });

            }
            this.setState({
              chartData:chartData,
              params:values.params,
            });
            break;
          }
          case '平均车头时距':{
            const chartData = [];
            for (let i = 0; i < flowState.length; i++) {
              // '交通流量','平均速度','平均占用时间','平均车头时距','平均车长'
              chartData.push({
                x: this.formatDate(flowState)[i],
                y1: this.formatAvgHeadTime(flowState)[i],
              });

            }
            this.setState({
              chartData:chartData,
              params:values.params,
            });
            break;
          }
          case '平均车长':{
            const chartData = [];
            for (let i = 0; i < flowState.length; i++) {
              chartData.push({
                x: this.formatDate(flowState)[i],
                y1: this.formatAvgLength(flowState)[i],
              });

            }
            this.setState({
              chartData:chartData,
              params:values.params,
            });
            break;
          }
        }
        // setup chart data -
      }
    });
  };

  handleParams(value){
    switch (value){
      case '交通流量':{
        this.setState({
          unit:'单位/辆',
        });
        break;
      }
      case '平均速度':{
        this.setState({
          unit:'平均速度(KM/H)',
        });
        break;
      }
      case '平均占用时间':{
        this.setState({
          unit:'单位/毫秒',
        });
        break;
      }
      case '平均车头时距':{
        this.setState({
          unit:'单位/毫秒',
        });
        break;
      }
      case '平均车长':{
        this.setState({
          unit:'单位/米',
        });
        break;
      }
    }
  }

  handleRoadName(value){
    this.props.dispatch({
      type:'flowChartTwo/fetchRoadName',
      payload: value,
    });

    this.props.dispatch({
      type:'flowChartTwo/fetchLaneNo',
      payload:value
    });

  }

  setupParamsOption(){
    let params = ['交通流量','平均速度','平均占用时间','平均车头时距','平均车长'];
    return params;
  }

  formatDate(data) {
    const formatedDate = [];
    data.forEach((v) => {
      formatedDate.push(v.DateTime)
    });
    return formatedDate
  };

  // 格式化交通流量
  formatFlow(data) {
    const formatedFlow = [];
    data.forEach((v) => {
      formatedFlow.push(v.DataList.Data.Volume)
    });
    return formatedFlow
  };

  // 格式化车速
  formatSpeed(data) {
    const formatedSpeed = [];
    data.forEach((v) => {
      formatedSpeed.push(v.DataList.Data.AvgSpeed)
    });
    return formatedSpeed
  };

  formatAvgOccupancy(data) {
    const formatedData = [];
    data.forEach((v) => {
      formatedData.push(v.DataList.Data.AvgOccupancy)
    });
    return formatedData
  }

  formatAvgHeadTime(data) {
    const formatedData = [];
    data.forEach((v) => {
      formatedData.push(v.DataList.Data.AvgHeadTime)
    });
    return formatedData
  }

  formatAvgLength(data) {
    const formatedData = [];
    data.forEach((v) => {
      formatedData.push(v.DataList.Data.AvgLength)
    });
    return formatedData
  }

  onChange(date, dateString) {
    this.setState({
      date:dateString
    })
  }
  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    // 设置CrossID
    let crossIDs = this.props.crossID || [];
    let crossOption = <Option key={1}>数据请求中</Option>;
    let laneNO = this.props.laneNo;
    let params = this.setupParamsOption();

    if (crossIDs != 0) {
      crossOption = crossIDs.map(id => <Option key={id}>{id}</Option>);
    }

    const laneOption = laneNO.map(i => <Option key={i}>{i}</Option>);
    const paramsOption = params.map( i => <Option key={i}>{i}</Option>);
    return (
      <div>
        <PageHeaderLayout title="车流量图表展示" content="">
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
                  <Select style={{width: 120}} onSelect = {this.handleRoadName}>
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
                  <Select style={{width: 120, marginRight: 20}}  >
                    {laneOption}
                  </Select>
                )}
              </FormItem>

              <FormItem
                label="查询参数"
              >
                {getFieldDecorator('params', {
                  rules: [{
                    required: true, message: '请选择查询参数',
                  }],
                })(
                  <Select style={{width: 140, marginRight: 20}}  onSelect = {this.handleParams}>
                    {paramsOption}
                  </Select>
                )}
              </FormItem>

              <FormItem
                label="选择日期"
              >
                {getFieldDecorator('moment', {
                  rules: [{
                    required: true, message: '请选择日期',
                  }],
                })(
                  <DatePicker  placeholder={'历史日期'} onChange={this.onChange}/>
                )}

              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit"
                        loading={this.props.loading}>Search</Button>
              </FormItem>
            </div>
          </Form>
          <TimelineChart
            title={this.props.roadName}
            height={200}
            titleMap={{y1: this.state.unit}}
            data={this.state.chartData}
          />
        </PageHeaderLayout>
      </div>
    )
  }
}
