import {routerRedux} from 'dva/router';
import {accountLogin} from "../services/flow";
import Cookies from 'js-cookie';

export default {

  namespace: 'login',
  state: {
    status: undefined,
    type:'account',
    userName: Cookies.get('userName') || null,
  },

  effects: {
    * login({payload}, {call, put}) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      // Login successfully
      if (response.status === 'ok') {
        yield put({
          type: 'addUserName',
          payload: response,
        });

        yield put(routerRedux.push('/'));
      }

    },
    * logout(_, {put}) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(routerRedux.push('/user/login'));
    },
    * invalidLogin(_, {put}) {
      yield put(routerRedux.push('/user/login'));
    }
  },


  reducers: {
    changeLoginStatus(state, {payload}) {
      return {
        ...state,
        status: payload.status,
        submitting: false,
      };
    },
    changeSubmitting(state, {payload}) {
      return {
        ...state,
        submitting: payload,
      };
    },
    addUserName(state, {payload}) {
      return {
        ...state,
        userName: payload.userName,
      }
    },
  },
};
