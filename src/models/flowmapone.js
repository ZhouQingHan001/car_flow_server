import {queryGateData} from '../services/device';
import {queryTotalFlow} from "../services/flow";

export default {
  namespace: 'flowMapOne',
  state: {
    markers: 0,
    loading: false,
    totalFlow: ''    // 车流量
  },

  effects: {
    * fetchMarkers(_, {call, put}) {
      yield put({
        type:'addLoading'
      });
      const response = yield call(queryGateData);
      const list = response.list;
     // 处理返回的数据 再次请求现有的 cross_id 的总流量
      const cross_id_arr = [];
      list.forEach((v)=>{
        cross_id_arr.push(v.cross_id)
      });
      const totalFlow = yield call(queryTotalFlow,cross_id_arr);

      totalFlow.forEach((v1)=>{
        list.forEach((v2,i2)=>{
            if(v1._id === v2.cross_id){
              list[i2].totalFlow = Math.floor(v1.totalFlow/2)
            }
        })
      });
      console.log(list);
      yield put({
        type: 'saveMarkers',
        payload: list
      });

      yield put({
        type:'saveTotal',
        payload:totalFlow
      });
      yield put({
        type:'hideLoading'
      })
    },

    * fetchTotalFlow({payload},{call, put}){
      const response = yield call(queryTotalFlow,payload);
      console.log(response);
      yield put({
        type:'saveTotal',
        payload:response.totalFlow
      })
    }

  },

  reducers: {
    saveTotal(state, action) {
      return {
        ...state,
        totalFlow:action.payload
      }
    },
    saveMarkers(state, action) {
      return {
        ...state,
        markers: action.payload
      };
    },
    addLoading(state) {
      return {
        ...state,
        loading: true
      }
    },
    hideLoading(state) {
      return {
        ...state,
        loading: false
      }
    }
  },
};
