import request from "./../utils/request.js";

// 登录接口
export function login(data) {
  return request({
    url: "/setGroups/login", // 登录接口
    method: "post",
    data: data, // 自动转换为 JSON
  });
}

// 注册接口
export function register(data) {
  return request({
    url: "/setGroups/register", // 注册接口
    method: "post",
    data: data,
  });
}

// 获取信息
export function getUserInfo(token) {
  return request({
    url: "/setGroups/getData",
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 同步到云端
export function setData(token, data) {
  return request({
    url: "/setGroups/setData",
    method: "post",
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 删除云端座位数据
export function deleteData(token, index) {
  return request({
    url: "/setGroups/delete",
    method: "delete",
    params: { index },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 更新云端用户数据
export function updateUserData(token, data) {
  return request({
    url: "/setGroups/updateUserInfo",
    method: "post",
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
