import {queryLaneAndLastMinutes, queryAllCrossID, findLaneNoById} from '../services/flow';
import {findRoadNameById} from '../services/device';

export default {
  namespace: 'flowChartOne',
  state: {
    flow: [],
    loading:false,
    road:{},
    laneNo:[]
  },

  effects: {
    * fetchCrossID(_, {call, put}){
      const response = yield call(queryAllCrossID);
      yield put({
        type:'saveCrossID',
        payload:response
      })
    },

    * fetchLaneNo({payload}, {call, put}) {
      const response = yield call(findLaneNoById,payload);
      yield put({
        type:'saveLaneNo',
        payload:response
      });

    },
    * fetchFlow({payload}, {call, put}) {
      // param: cross_id,lane,last
      yield put({
        type: 'addLoading',
      });
      const response = yield call(queryLaneAndLastMinutes,payload);
      let  res = [];
      response.forEach((v)=>{
        res.push(v.CrossTrafficData)
      });
      yield put({
        type: 'saveFlow',
        payload: res,
      });

      yield put({
        type:'hideLoading',
      })

    },
    * fetchRoadName({payload},{call, put}) {
      let response = yield call(findRoadNameById,payload);
      if(!response){
        response = {};
        response.roadName = '未命名道路'
      }
      yield put({
        type:'saveRoad',
        payload:response,
      })
    },
  },

  reducers: {
    saveLaneNo(state, action){
      return {
        ...state,
        laneNo:action.payload
      }
    },
    saveRoad(state, action) {
      return {
        ...state,
        road:action.payload
      }
    },
    saveFlow(state, action) {
      return {
        ...state,
        flow: action.payload,
      };
    },
    saveCrossID(state, action) {
      return {
        ...state,
        crossID:action.payload
      }
    },
    addLoading(state){
      return{
        ...state,
        loading:true
      }
    },
    hideLoading(state){
      return{
        ...state,
        loading:false
      }
    }
  },
};
