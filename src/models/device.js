import {message} from 'antd';
import {addGateData, alterGateData, deleteGateData} from '../services/device';
import {queryGateData} from '../services/device';

export default {
  namespace: 'device',
  state: {
    loading: false,
    gateList: [],
    gateListCache: [],
    visible:false,
  },
  effects: {
    * getGateList(_, {call, put}) {
      const result = yield call(queryGateData);
      console.log(result);
      yield put({
        type: 'getGateListLocal',
        payload: result,
      })
    },

    * submitGateForm({payload}, {call, put}) {
      yield put({
        type: 'changeGateFormSubmitting',
        payload: true
      });

      const result =  yield call(addGateData, payload);

      if(result.message === 'ok'){
        yield put({
          type: 'changeGateFormSubmitting',
          payload: false
        });
        yield put({
          type: 'changeGateFormVisibility',
          payload: false
        });
        message.success('提交成功');

        const result = yield call(queryGateData);
        yield put({
          type: 'getGateListLocal',
          payload: result,
        });

      } else {
        message.success('提交失败');
      }
    },

    // 修改保存同步到数据库
    * saveGateList({payload}, {call, put}) {

      const target = payload.newData.filter(item => payload.cross_id === item.cross_id)[0];

      if (target) {
        yield put({
          type: 'changeGateFormSubmitting',
          payload: true
        });
         yield call(alterGateData, target);
      }

      yield put({
        type: 'saveGateListLocal',
        payload: payload.cross_id
      });

      yield put({
        type: 'changeGateFormSubmitting',
        payload: false
      });

    },
    * deleteGate({payload},{call, put}){
      yield put({
        type: 'changeGateFormSubmitting',
        payload: true
      });

      yield call(deleteGateData,payload);


      yield put({
        type: 'changeGateFormSubmitting',
        payload: false
      });

      const result = yield call(queryGateData);
      yield put({
        type: 'getGateListLocal',
        payload: result,
      });
    }

  },
  reducers: {
    changeGateFormSubmitting(state, {payload}) {
      return {
        ...state,
        loading: payload,
      };
    },
    changeGateFormVisibility(state,{payload}) {
      return {
        ...state,
        visible:payload
      }
    },
    getGateListLocal(state, {payload}) {
      return {
        ...state,
        gateList: payload.list
      }
    },

    editGateList(state, {payload}) {

      const newData = [...state.gateList];
      const target = newData.filter(item => payload === item.cross_id)[0];
      if (target) {
        target.editable = true;
        return {
          ...state,
          gateList: newData
        }
      } else {
        return ({...state});
      }
    },
    // 修改的数据 保存到状态管理
    saveGateListLocal(state, {payload}) {

      const newData = [...state.gateList];
      const target = newData.filter(item => payload === item.cross_id)[0];

      if (target) {
        delete target.editable;
        const cacheData = newData.map(item => ({...item}));
        return ({...state, gateList: newData, gateListCache: cacheData});
      } else {
        return ({...state});
      }
    },

    // 处理修改 input 事件的逻辑
    onHandleGateChange(state, {payload}) {
      const newData = [...state.gateList];
      const target = newData.filter(item => payload.cross_id === item.cross_id)[0];
      if (target) {
        target[payload.column] = payload.value;
        return ({...state, gateList: newData});
      } else {
        return ({...state});
      }
    },

    // 取消的修改的逻辑
    cancelGateList(state, {payload}) {
      const newData = [...state.gateList];
      const target = newData.filter(item => payload === item.cross_id)[0];
      if (target) {
        // 取消-回退缓存
        Object.assign(target, state.gateListCache.filter(item => payload === item.cross_id)[0]);
        delete target.editable;
        return ({...state, gateList: newData});
      } else {
        return ({...state});
      }

    }

  }
}
