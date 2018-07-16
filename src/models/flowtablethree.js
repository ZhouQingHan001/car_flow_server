import {queryRangeById, queryAllCrossID,findLaneNoById} from '../services/flow';
import {findRoadNameById} from '../services/device';

export default {
  namespace: 'flowTableThree',
  state: {
    flow: [],
    loading:false,
    currentPage:1,
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

    * fetchFlowById({payload}, {call, put}) {
      console.log('fetch');
      // param: cross_id,lane,last
      yield put({
        type: 'addLoading',
      });
      const response = yield call(queryRangeById,payload);
      let  res = [];
      let total_count = response.pop().total_count;

      response.forEach((v)=>{
        res.push(v.CrossTrafficData)
      });


      yield put({
        type: 'saveFlow',
        payload: res,
      });

      yield put({
        type: 'savePageCount',
        payload: total_count,
      });

      yield put({
        type:'hideLoading',
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
    },
    savePageCount(state, action) {

      state.total_page = 0;
      console.log(action);
      return {
        ...state,
        total_page: action.payload
      }
    },
  },
};
