import request from '@/utils/request'

// 请求登录
export const login = data =>
  request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data,
  })

// 请求验证码
export const sendSms = mobile =>
  request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`,
  })

// 请求用户信息
export const getUserInfo = () =>
  request({
    method: 'GET',
    url: '/v1_0/user',
  })

// 请求用户频道列表
export const getUserChannels = () =>
  request({
    method: 'GET',
    url: '/v1_0/user/channels',
  })

// 请求关注用户
export const addFollow = data =>
  request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data,
  })

// 请求取关用户
export const deleteFollow = target =>
  request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`,
  })

// 请求当前用户资料
export const getUserProfile = () =>
  request({
    method: 'GET',
    url: '/v1_0/user/profile',
  })

// 请求更新用户资料
export const updateUserProfile = data =>
  request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data,
  })

// 请求更新用户头像
export const updateUserPhoto = data =>
  request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data,
  })
