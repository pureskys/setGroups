import Cookies from 'js-cookie'

// 保存 Token 到 Cookie (默认1天过期)
export function saveToken(token, expiresDays = 1) {
  Cookies.set('setGroupsToken', token, { expires: expiresDays })
}

// 从 Cookie 获取 Token
export function getToken() {
  return Cookies.get('setGroupsToken')
}

// 删除 Token
export function removeToken() {
  Cookies.remove('setGroupsToken')
}