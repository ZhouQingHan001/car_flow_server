import mockjs from 'mockjs';
import {getRule, postRule} from './mock/rule';
import {getActivities, getFakeList, getNotice} from './mock/api';
import gateList from './mock/device';
import {getFakeChartData} from './mock/chart';
import {getProfileAdvancedData, getProfileBasicData} from './mock/profile';
import {getNotices} from './mock/notices';
import {delay, format} from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array

  // 'GET /api/currentUser':{
  //   name: 'momo.zxy',
  //   userid:'0000001',
  //   notifyCount:12
  // },

 /* 'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },*/

  // // GET POST 可省略
  // 'GET /api/users': [{
  //   key: '1',
  //   name: 'John Brown',
  //   age: 32,
  //   address: 'New York No. 1 Lake Park',
  // }, {
  //   key: '2',
  //   name: 'Jim Green',
  //   age: 42,
  //   address: 'London No. 1 Lake Park',
  // }, {
  //   key: '3',
  //   name: 'Joe Black',
  //   age: 32,
  //   address: 'Sidney No. 1 Lake Park',
  // }],
  // 'GET /api/project/notice': getNotice,
  // 'GET /api/activities': getActivities,
  // 'GET /api/rule': getRule,
  // 'POST /api/rule': {
  //   $params: {
  //     pageSize: {
  //       desc: '分页',
  //       exp: 2,
  //     },
  //   },
  //   $body: postRule,
  // },
  // 'GET /api/save_forms': (req, res) => {
  //   res.send({message: 'Ok'});
  // },
  // 'GET /api/tags': mockjs.mock({
  //   'list|100': [{name: '@city', 'value|1-100': 150, 'type|0-2': 1}]
  // }),
  // 'GET /api/fake_list': getFakeList,
  // 'GET /api/fake_chart_data': getFakeChartData,
  // 'GET /api/profile/basic': getProfileBasicData,
  // 'GET /api/profile/advanced': getProfileAdvancedData,
  // 'GET /api/gate_data':gateList

/*  'POST /api/login/account': (req, res) => {
    const {password, userName, type} = req.body;
    res.send({
      status: password === '888888' && userName === 'admin' ? 'ok' : 'error',
      type,
    });
  },*/
/*  'POST /api/register': (req, res) => {
    res.send({status: 'ok'});
  },
  'GET /api/notices': getNotices,*/
};

export default noProxy ? {} : delay(proxy, 1000);
