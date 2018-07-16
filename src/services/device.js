import request from '../utils/request';
const key = 'http://192.168.1.128:4002/api/method=get&appkey=436etaq52e57a3cd028ab56b&seckey=sec-mj12Slu12w1Xs1er8ZzmGZqw5qrpFmqw25jHULr13eUZCswA';

export async function queryGateData() {

  return request(`${key}/v1/device/get_device`,{
    method:'GET',
    mode:'cors',
    credentials: "",
  });
}

export async function addGateData(payload) {

  return request(`${key}/v1/device/add_device/${payload.cross_id}/${payload.road_name}/${payload.longitude}/${payload.latitude}`, {
    method:'GET',
    mode:'cors',
    credentials: "",
  });
}

export async function alterGateData(payload) {

  return request(`${key}/v1/device/alter_device/${payload.cross_id}/${payload.road_name}/${payload.longitude}/${payload.latitude}`, {
    method:'GET',
    mode:'cors',
    credentials: "",
  })

}

export async function deleteGateData(payload) {

  return request(`${key}/v1/device/delete_device/${payload}`,{
    method:'GET',
    mode:'cors',
    credentials: "",
  })

}

export async function findRoadNameById(payload) {

  return request(`${key}/v1/device/get_device_name/${payload}`,{
    method:'GET',
    mode:'cors',
    credentials: "",
  })
}


