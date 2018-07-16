import request from '../utils/request';

const key = 'http://192.168.1.128:4002/api/method=get&appkey=436etaq52e57a3cd028ab56b&seckey=sec-mj12Slu12w1Xs1er8ZzmGZqw5qrpFmqw25jHULr13eUZCswA';
// TODO 加密 cors 暂时使用get
export async function accountLogin(payload) {

  return request(`${key}/v1/user/login/account/${payload.userName}/${payload.password}`, {
    method:'GET',
    mode:'cors',
    credentials: "",
  })

}

export async function queryCurrent(payload) {

  return request(`${key}/v1/user/currentUser`,{
    method:'GET',
    mode:'cors',
    credentials: "",
  });
}
// 命名有点问题 这个查倒数几条
export async function queryLaneLastMinutes(payload) {

  return request(`${key}/v1/carflow/cross/${payload.cross_id}/lane/${payload.lane}/last/${payload.last}`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  });
}

// 查倒数几分钟
export async function queryLaneAndLastMinutes(payload) {
  return request(`${key}/v1/carflow/cross/${payload.cross_id}/lane/${payload.lane}/last_minutes/${payload.last_minutes}`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  })
}

export async function queryAllCrossID() {

  return request(`${key}/v1/carflow/allcrossid`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  });

}


export async function queryRangeByLaneAndTime(payload) {

  return request(`${key}/v1/carflow/cross/${payload.cross_id}/lane/lanestart=${payload.lane_start}&laneend=${payload.lane_end}/start=${payload.time_start}&end=${payload.time_end}/${payload.currentPage}`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  });
}

///cross/:id/start=:timestart&end=:timeend/:page
export async function queryRangeById(payload) {
  return request(`${key}/v1/carflow/cross/${payload.cross_id}/start=${payload.time_start}&end=${payload.time_end}/${payload.currentPage}`, {
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  })
}

// 根据cross_id 查询 所有的laneNo
export async function findLaneNoById(payload) {
  return request(`${key}/v1/carflow/getlane/${payload}`, {
    method:'GET',
    mode:'cors',
    credentials:'',
    cache:'default',
  })
}


// 查询历史某一天的数据
export async function findHistory(payload) {

  return request(`${key}/v1/carflow/cross/${payload.cross_id}/lane/${payload.lane}/history/${payload.date}`, {
    method:'GET',
    mode:'cors',
    credentials:'',
    cache:'default',
  })

}

// 查询某个路口所有的车流量总和
export async function queryTotalFlow(payload) {

  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  return request(`${key}/v1/carflow/cross/summary`,{
    method:'POST',
    mode:'cors',
    credentials:'',
    body:payload,
    headers:myHeaders,
    cache:'default',
  })
}



