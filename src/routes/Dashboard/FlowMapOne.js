import React, {Component} from 'react';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import {Form} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Map, Markers} from 'react-amap';
import marker from '../../../public/wxp1.png';
import crowdedMarker from '../../../public/wxp2.png';
import {Button} from 'antd';

const AMAP_KEY = '0b6a63378b58a33f54033492e74b7750';

const style = {
  border:'none',
  color:'black',
  fontSize:'12',
  width:80,
  height:64,
  position:'relative',
  background:`url(${marker}) no-repeat center`,
};

const styleCrowded = {
  border:'none',
  color:'black',
  fontSize:'12',
  width:80,
  height:64,
  position:'relative',
  background:`url(${crowdedMarker}) no-repeat center`,
};


@connect((state) => ({
  markers: state.flowMapOne.markers,
  totalFlow: '总车流量：'+ state.flowMapOne.totalFlow,
  loading:state.flowMapOne.loading,
}))

@Form.create()
export default class FlowMapOne extends Component {
  constructor(props) {
    super(props);
    const plugins = [
      'MapType',
      'Scale',
      'OverView',
      'ControlBar', // v1.1.0 新增
      {
        name: 'ToolBar',
        options: {
          visible: true,  // 不设置该属性默认就是 true
          onCreated(ins){
            console.log(ins);
          },
        },
      }
    ];
    this.props.dispatch({
      type: 'flowMapOne/fetchMarkers'
    });

    this.markerEvents = {
      mouseover:(e, marker) => {
        marker.render(this.renderMouseoverLayout);
      },
      mouseout: (e, marker) => {
        marker.render(this.renderMarkerLayout);
      },
      // click:(e, marker) => {
      //   marker.render(this.renderClickLayout);
      // }
    }
  }

  renderMarkerLayout(extData){
    console.log(extData.totalFlow);
    if(extData.totalFlow > 20 ){
      return <div style={styleCrowded}>

      </div>
    } else {
      return <div style={style}>

      </div>
    }

  }
  renderMouseoverLayout(extData){
    return <div style={style}>
      <span style={{backgroundColor:'#fff',display:'block',position:'absolute', top:'-30px'}}>{extData.myLabel}{extData.currentFlow}</span>
      </div>
  }

  renderClickLayout(extData){
    return <div style={style}>

    </div>
  }

  // 处理表单提交
  render() {
    const markerArr = [];
    if(this.props.markers){
      this.props.markers.forEach((v,i)=>{
        markerArr.push({
          position:{
            latitude: v.latitude,
            longitude: v.longitude,
          },
          myLabel: v.road_name,
          myIndex: i + 1,
          cross_id: v.cross_id,
          currentFlow:'当前车流量：'+ v.totalFlow,
          totalFlow:v.totalFlow,
        })
      });
    }
    return (
      <div>
        <PageHeaderLayout title="车流量地图展示" content="">
          <div style={{ width: 1000, height: 700 }}>
            <Button loading = {this.props.loading} style={{marginBottom:'20px'}} onClick={()=>{
              this.props.dispatch({
                type: 'flowMapOne/fetchMarkers'
              });
            }} >
              刷 新
            </Button>
            <Map  plugins={['ToolBar']} amapkey={AMAP_KEY} zoom={5} center={{ longitude: 120.32612360300594, latitude: 30.323946922423936 }}>
              <Markers
                markers={markerArr}
                render={this.renderMarkerLayout}
                events={this.markerEvents}
              />
            </Map>
          </div>
        </PageHeaderLayout>
  </div>
  )
  }
}
