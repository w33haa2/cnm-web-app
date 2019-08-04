import SecureLS from 'secure-ls'
// import axios from 'axios'
import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'
import router, { resetRouter } from '@/router'
const LOGIN = generateMutationTypes('auth', 'LOGIN')
const LOGOUT = generateMutationTypes('auth', 'LOGOUT')
const FETCH_USER_STATUS_LIST = generateMutationTypes(
  'user_status',
  'FETCH_USER_STATUS_LIST'
)
const FETCH_USER_COMRADES = generateMutationTypes(
  'user_status',
  'FETCH_USER_COMRADES'
)
const FETCH_POTENTIAL_HEAD = generateMutationTypes(
  'position_cascade_select',
  'FETCH_POTENTIAL_HEAD'
)

var ls = new SecureLS({
  encodingType: 'aes'
})

const state = {
  token: ls.get('token').access_token,
  userDetails: {
    full_name: ls.get('token_info').full_name,
    id: ls.get('token_info').id,
    firstname: ls.get('token_info').firstname,
    lastname: ls.get('token_info').lastname,
    middlename: ls.get('token_info').middlename,
    birth_date: ls.get('token_info').birth_date,
    gender: ls.get('token_info').gender,
    address: ls.get('token_info').address,
    p_email: ls.get('token_info').p_email,
    contact_number: ls.get('token_info').contact_number,
    company_id: ls.get('token_info').company_id,
    position: ls.get('token_info').position,
    image_url: ls.get('token_info').image_url,
    login_flag: ls.get('token_info').login_flag,
    head: ls.get('token_info').head,
    hired_date: ls.get('token_info').hired_date,
    c_email: ls.get('token_info').c_email,
    contract: ls.get('token_info').contract
  },
  avatar: '',
  introduction: '',
  userErrors: '',
  comrades: [],
  comradesTotal: 0,
  fetchingComradeState: {
    initial: false,
    success: false,
    fail: false
  },
  loggingInState: {
    initial: false,
    success: false,
    fail: false
  },
  roles: [],
  // structure
  data: {
    statusList: [],
    potentialHead: []
  },
  fetchState: {
    statusList: {
      initial: false,
      success: false,
      fail: false
    },
    potentialHead: {
      initial: false,
      success: false,
      fail: false
    }
  },
  count: {
    statusList: 0
  },
  errors: {
    statusList: null,
    potentialHead: null
  }
}
const mutations = {
  /**
   * Commits initial state for fetching incident reports
   * @param state
   */
  [FETCH_USER_COMRADES.initial](state) {
    state.fetchingComradeState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching incident reports
   * @param state
   */
  [FETCH_USER_COMRADES.success](state, payload) {
    state.fetchingComradeState = {
      initial: false,
      success: true,
      fail: false
    }
    state.comrades = payload.meta.metadata
    state.comradesTotal = payload.meta.count
  },
  /**
   * Commits fail state for fetching incident reports
   * @param state
   */
  [FETCH_USER_COMRADES.fail](state, payload) {
    state.fetchingComradeState = {
      initial: false,
      success: false,
      fail: true
    }
    state.userErrors = payload.response.data.title
    state.comrades = []
    state.comradesTotal = 0
  },
  [LOGIN.initial](state) {
    state.loggingInState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  [LOGIN.success](state, payload) {
    state.loggingInState = {
      initial: false,
      success: true,
      fail: false
    }
    state.token = payload.meta.token.access_token
    state.userDetails.full_name = payload.meta.user.full_name
    state.userDetails.birth_date = payload.meta.user.info.birthdate
    state.userDetails.gender = payload.meta.user.info.gender
    state.userDetails.address = payload.meta.user.info.address
    state.userDetails.p_email = payload.meta.user.info.p_email
    state.userDetails.contact_number = payload.meta.user.info.contact_number
    state.userDetails.company_id = payload.meta.user.company_id
    state.userDetails.position = payload.meta.user.access.name
    state.userDetails.login_flag = payload.meta.user.loginFlag
    state.userDetails.head =
      payload.meta.user.access.parent !== null
        ? payload.meta.user.access.parent
        : 'N/A'
    state.userDetails.hired_date = payload.meta.user.info.hired_date
    state.userDetails.c_email = payload.meta.user.email
    state.userDetails.image_url = payload.meta.user.info.image_url
    state.userDetails.firstname = payload.meta.user.info.firstname
    state.userDetails.middlename = payload.meta.user.info.middlename
    state.userDetails.lastname = payload.meta.user.info.lastname
    state.userDetails.id = payload.meta.user.info.id
    state.userDetails.contract = payload.meta.user.contract
    ls.set('token', { access_token: state.token })
    ls.set('token_info', {
      full_name: state.userDetails.full_name,
      birth_date: state.userDetails.birth_date,
      gender: state.userDetails.gender,
      address: state.userDetails.address,
      p_email: state.userDetails.p_email,
      contact_number: state.userDetails.contact_number,
      company_id: state.userDetails.company_id,
      position: state.userDetails.position,
      head: state.userDetails.head,
      hired_date: state.userDetails.hired_date,
      c_email: state.userDetails.c_email,
      image_url: state.userDetails.image_url,
      contract: state.userDetails.contract,
      firstname: state.userDetails.firstname,
      middlename: state.userDetails.middlename,
      lastname: state.userDetails.lastname,
      login_flag: state.userDetails.login_flag,
      id: state.userDetails.id
    })

    // router.push({
    //   path: "/dashboard"
    // });
  },
  [LOGIN.fail](state, payload) {
    state.loggingInState = {
      initial: false,
      success: false,
      fail: true
    }
  },
  [LOGOUT.success](state, payload) {
    state.token = null
    state.userFullName = null
    state.userEmail = null
    state.loginSuccess = false
    resetRouter()
    ls.removeAll()
    router.push({
      path: '/login'
    })
  },
  [LOGOUT.fail](state, payload) {
    state.token = null
    state.userFullName = null
    state.userEmail = null
    state.loginSuccess = false
  },
  // FETCH USER STATUS LIST
  // initial
  [FETCH_USER_STATUS_LIST.initial](state) {
    state.fetchState.statusList = {
      initial: true,
      success: false,
      fail: false
    }
  },
  [FETCH_USER_STATUS_LIST.success](state, payload) {
    state.fetchState.statusList = {
      initial: false,
      success: true,
      fail: false
    }
    state.data.statusList = payload.meta.metadata
    state.count.statusList = payload.meta.count
  },
  [FETCH_USER_STATUS_LIST.fail](state, payload) {
    state.fetchState.statusList = {
      initial: false,
      success: false,
      fail: true
    }
    state.errors.statusList = payload.response.data.title
  },
  // FETCH POTENTIAL HEAD LIST
  // initial
  [FETCH_POTENTIAL_HEAD.initial](state) {
    state.fetchState.potentialHead = {
      initial: true,
      success: false,
      fail: false
    }
  },
  [FETCH_POTENTIAL_HEAD.success](state, payload) {
    state.fetchState.potentialHead = {
      initial: false,
      success: true,
      fail: false
    }
    state.data.potentialHead = payload.meta.metadata
  },
  [FETCH_POTENTIAL_HEAD.fail](state, payload) {
    state.fetchState.potentialHead = {
      initial: false,
      success: false,
      fail: true
    }
    state.errors.potentialHead = payload.response.data.title
  }
  // SET_TOK,EN: (state, token) => {
  //   state.token = token
  // },
  // SET_INTRODUCTION: (state, introduction) => {
  //   state.introduction = introduction
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  // SET_ROLES: (state, roles) => {
  //   state.roles = roles
  // }
}

const actions = {
  /**
   * Action for fetching user comrades
   * @param commit
   * @param params
   */
  fetchComrades({ commit }, params) {
    const slug = 'api.reports.allUsers'
    STATE_API({ slug, params }, commit, [
      FETCH_USER_COMRADES.initial,
      FETCH_USER_COMRADES.success,
      FETCH_USER_COMRADES.fail
    ])
  },
  authenticate({ commit }, params) {
    const slug = 'auth.login'
    STATE_API({ slug, params: params.data }, commit, [
      LOGIN.initial,
      LOGIN.success,
      LOGIN.fail
    ])
  },
  logout({ commit }) {
    const slug = 'auth.logout'
    STATE_API({ slug }, commit, [LOGOUT.success, LOGOUT.fail])
  },
  // fetch user_status_list
  fetchStatusList({ commit }, params) {
    const slug = 'api.users.statusList'
    params = params.data
    STATE_API({ slug, params }, commit, [
      FETCH_USER_STATUS_LIST.initial,
      FETCH_USER_STATUS_LIST.success,
      FETCH_USER_STATUS_LIST.fail
    ])
  },
  fetchPotentialHead({ commit }, params) {
    const slug = 'api.users.fetchAll'
    params = params.data
    STATE_API({ slug, params }, commit, [
      FETCH_POTENTIAL_HEAD.initial,
      FETCH_POTENTIAL_HEAD.success,
      FETCH_POTENTIAL_HEAD.fail
    ])
  }
}

export default {
  state,
  mutations,
  actions
}
