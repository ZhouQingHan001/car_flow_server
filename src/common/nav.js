import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '设备信息录入',
        icon: 'form',
        path: 'dashboard',
        children: [
          {
            name: '网关信息录入',
            path: 'gateform',
            component: dynamicWrapper(app, ['device'], () => import('../routes/Forms/GateForm')),
          },
        ],
      },
      {
        name:'车流量检测-Table',
        path:'flow',
        icon:'dashboard',
        children:[
          {
            name:'车流量-Table 1',
            path:'table1',
            component:dynamicWrapper(app, ['flowtableone'], ()=> import('../routes/Dashboard/FlowTableOne')),

          },
          {
            name:'车流量-Table 2',
            path:'table2',
            component:dynamicWrapper(app, ['flowtabletwo'], ()=> import('../routes/Dashboard/FlowTableTwo')),

          },
          {
            name:'车流量-Table 3',
            path:'table3',
            component:dynamicWrapper(app, ['flowtablethree'], ()=> import('../routes/Dashboard/FlowTableThree')),

          }
        ]
      },
      {
        name:'车流量检测-Chart',
        path:'chart',
        icon:'dashboard',
        children:[
          {
            name:'车流量-Chart 1',
            path:'chart1',
            component:dynamicWrapper(app, ['flowchartone'], ()=> import('../routes/Dashboard/FlowChartOne')),
          },
          {
            name:'车流量-Chart 2',
            path:'chart2',
            component:dynamicWrapper(app, ['flowcharttwo'], ()=> import('../routes/Dashboard/FlowChartTwo')),
          },
        ]
      },
      {
        name:'车流量地图-Map',
        path:'map',
        icon:'profile',
        children:[
          {
            name:'车流量-Map 1',
            path:'map1',
            component:dynamicWrapper(app, ['flowmapone'], ()=> import('../routes/Dashboard/FlowMapOne')),
          },
        ]
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          },
/*          {
            name: '注册',
            path: 'register',
            component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
          },
          {
            name: '注册结果',
            path: 'register-result',
            component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
          },*/
        ],
      },
    ],
  },
  /*{
    component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
    layout: 'BlankLayout',
    children: {
      name: '使用文档',
      path: 'http://pro.ant.design/docs/getting-started',
      target: '_blank',
      icon: 'book',
    },
  },*/
];
