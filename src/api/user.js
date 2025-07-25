import request from "./../utils/request.js";
import { removeToken } from "../utils/auth.js";

// 登录接口
export function login(data) {
  return request({
    url: "/auth/login", // 登录接口
    method: "post",
    data: data, // 自动转换为 JSON
  });
}

// 注册接口
export function register(data) {
  return request({
    url: "/users", // 注册接口
    method: "post",
    data: data,
  });
}

// 获取用户信息
export function getUserInfo(token) {
  return request({
    url: "/users",
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    // 清除 cookies
    removeToken();
    // 刷新页面
    window.location.reload();
    // 仍然抛出错误以便外部可以捕获
    return Promise.reject(error);
  });
}

// 获取座位信息
export function getSetGroups(token) {
  return request({
    url: "/set-groups",
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 同步到云端
export function setData(token, data) {
  return request({
    url: "/set-groups",
    method: "post",
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    // 清除 cookies
    removeToken();
    // 刷新页面
    window.location.reload();
    // 仍然抛出错误以便外部可以捕获
    return Promise.reject(error);
  });
}

// 删除云端座位数据
export function deleteData(token, index) {
  return request({
    url: `/set-groups/${index}`,
    method: "delete",
    params: { index },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    // 清除 cookies
    removeToken();
    // 刷新页面
    window.location.reload();
    // 仍然抛出错误以便外部可以捕获
    return Promise.reject(error);
  });
}

// 修改用户信息
export function updateUserData(token, data) {
  return request({
    url: "/users",
    method: "patch",
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    // 清除 cookies
    removeToken();
    // 刷新页面
    window.location.reload();
    // 仍然抛出错误以便外部可以捕获
    return Promise.reject(error);
  });
}
