import {queryRangeByLaneAndTime ,queryAllCrossID,findLaneNoById} from '../services/flow';
import {findRoadNameById} from '../services/device';

export default {
  namespace: 'flowTableTwo',
  state: {
    flow: [],
    crossID:[],
    total_page:0,
    loading:false,
    road:{},
    laneNo:[],
  },

  effects: {
    * fetchLaneNo({payload}, {call, put}) {
      const response = yield call(findLaneNoById,payload);
      yield put({
        type:'saveLaneNo',
        payload:response
      });

    },

    * fetchCrossID(_, {call, put}){
      const response = yield call(queryAllCrossID);
      yield put({
        type:'saveCrossID',
        payload:response
      })
    },

    * fetchFlowByRange({payload}, {call, put}) {

      yield put({
        type:'addLoading',
      });
      // param playload.cross_id  playload.lane_start playload.lane_end playload.time_start playload.time_end
      const response = yield call(queryRangeByLaneAndTime,payload);
      console.log('end fetch');
      let  res = [];
      let total_count = response.pop().total_count;
      console.log(response, total_count);

      response.forEach((v)=>{
        res.push(v.CrossTrafficData)
      });

      yield put({
        type: 'saveRangeFlow',
        payload: res,
      });

      yield put({
        type: 'savePageCount',
        payload: total_count,
      });
      yield put({
        type:'hideLoading',
      });
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
    saveRangeFlow(state, action) {
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
    savePageCount(state, action) {

      state.total_page = 0;
      console.log(action);
      return {
        ...state,
        total_page: action.payload
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
