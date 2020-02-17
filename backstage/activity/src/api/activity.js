import request from '@root/publicMethods/request'


export function redictActivityToUsers(data) {
  return request({
    url: '/manage/activity/redictActivityToUsers',
    data,
    method: 'post'
  })
}

export function activityList(params) {
  return request({
    url: '/manage/activity/getList',
    params,
    method: 'get'
  })
}

export function getOneActivity(params) {
  return request({
    url: '/manage/activity/getActivity',
    params,
    method: 'get'
  })
}

export function addActivity(data) {
  return request({
    url: '/manage/activity/addActivity',
    data,
    method: 'post'
  })
}

export function updateActivity(data) {
  return request({
    url: '/manage/activity/updateOne',
    data,
    method: 'post'
  })
}

export function deleteActivity(params) {
  return request({
    url: '/manage/activity/deleteActivity',
    params,
    method: 'get'
  })
}

export function getRandomActivityImg(params) {
  return request({
    url: '/api/activity/getRandomActivityImg',
    params,
    method: 'get'
  })
}

export function regUserList(params) {
  return request({
    url: '/manage/regUser/getList',
    params,
    method: 'get'
  })
}