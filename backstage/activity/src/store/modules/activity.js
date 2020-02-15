import * as types from '../types.js';
import {
  activityList,
  getOneActivity
} from '@/api/activity';
import _ from 'lodash';


const state = {
  formState: {
    edit: false,
    formData: {
      targetUser: '',
      title: '',
      stitle: '',
      type: '1',
      categories: [],
      keywords: '',
      sortPath: '',
      tags: [],
      keywords: '',
      sImg: '/static/upload/images/defaultImg.jpg',
      discription: '',
      author: {},
      uAuthor: '',
      markDownComments: '',
      state: '1',
      isTop: 0,
      roofPlacement: '0',
      clickNum: 0,
      comments: '',
      simpleComments: '',
      commentNum: 0,
      likeNum: 0,
      dismissReason: '',

    }
  },
  activityList: {
    pageInfo: {},
    docs: []
  },
  directUser: {
    formState: {
      show: false,
      edit: false,
      formData: {
        name: '',
        alias: '',
        targetUser: ''
      }
    }
  },
}

const mutations = {
  [types.ACTIVITY_FORMSTATE](state, formState) {
    state.formState.edit = formState.edit;
    state.formState.formData = Object.assign({
      targetUser: '',
      title: '',
      stitle: '',
      type: '1',
      categories: [],
      keywords: '',
      sortPath: '',
      tags: [],
      keywords: '',
      sImg: '',
      discription: '',
      author: {},
      uAuthor: '',
      markDownComments: '',
      state: '1',
      isTop: 0,
      roofPlacement: '0',
      clickNum: 0,
      comments: '',
      simpleComments: '',
      commentNum: 0,
      likeNum: 0
    }, formState.formData);

  },
  [types.ACTIVITY_LIST](state, activityList) {
    state.activityList = activityList
  },
  [types.ACTIVITY_ONE](state, content) {
    state.content = content
  },
  [types.DIRECTUSERFORMSTATE](state, formState) {
    state.directUser.formState.show = formState.show;
    state.directUser.formState.edit = formState.edit;
    state.directUser.formState.type = formState.type;
    state.directUser.formState.formData = Object.assign({
      name: '',
      alias: '',
      targetUser: ''
    }, formState.formData);
  },
}

const actions = {

  showActivityForm: ({
    commit
  }, params = {
    edit: false,
    formData: {}
  }) => {
    commit(types.ACTIVITY_FORMSTATE, {
      edit: params.edit,
      formData: params.formData
    })
  },
  showDirectUserForm: ({
    commit
  }, params = {
    edit: false,
    formData: {}
  }) => {
    commit(types.DIRECTUSERFORMSTATE, {
      show: true,
      edit: params.edit,
      formData: params.formData
    })
  },
  hideDirectUserForm: ({
    commit
  }) => {
    commit(types.DIRECTUSERFORMSTATE, {
      show: false
    })
  },
  getActivityList({
    commit
  }, params = {}) {
    activityList(params).then((result) => {
      commit(types.ACTIVITY_LIST, result.data)
    })
  },

  getOneActivity({
    commit
  }, params = {}) {
    getOneActivity(params).then((result) => {
      commit(types.ACTIVITY_ONE, result.data)
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}