import mockjs from 'mockjs';

let Random = mockjs.Random;


Random.extend({
  road: function(date) {
    let roads  = ['同协路-邻丁路路口', '同协路-机场路口', '同协路-石大路路口', '同协路-天城路路口'];
    return this.pick(roads)
  }
});


/**
 *  cross_id / sensor_id   关联进行表的关联
 * **/
let gateList = mockjs.mock({
    'list|20': [{
    'cross_id|+1':17092304, // 网关
    'roadName': '@ROAD', // 道路名称
    'latitude|100-200.8':1.123,
    'longitude|100-200.8':1.123,
    }],
});


export default  gateList;



