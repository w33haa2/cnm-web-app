
import SecureLS from 'secure-ls'
// import axios from 'axios'
import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'
import router, { resetRouter } from '@/router'
const LOGIN = generateMutationTypes('auth', 'LOGIN')
const LOGOUT = generateMutationTypes('auth', 'LOGOUT')

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
    head: ls.get('token_info').head,
    hired_date: ls.get('token_info').hired_date,
    c_email: ls.get('token_info').c_email,
    contract: ls.get('token_info').contract,
  },
  avatar: '',
  introduction: '',
  loggingInState: {
    initial: false,
    success: false,
    fail: false
  },
  roles: []
}
const mutations = {
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
    state.userDetails.head = payload.meta.user.access.parent !== null ? payload.meta.user.access.parent : "N/A"
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
      id: state.userDetails.id,

    })

    router.push({
      path: '/dashboard'
    })
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
  }
  // SET_TOKEN: (state, token) => {
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
  authenticate({ commit }, params) {
    const slug = 'auth.login'
    STATE_API({ slug, params: params.data }, commit, [LOGIN.initial, LOGIN.success, LOGIN.fail])
  },
  logout({ commit }) {
    const slug = 'auth.logout'
    STATE_API({ slug }, commit, [LOGOUT.success, LOGOUT.fail])
  }
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  //
  // // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response
  //
  //       if (!data) {
  //         reject('Verification failed, please Login again.')
  //       }
  //
  //       const { roles, name, avatar, introduction } = data
  //
  //       // roles must be a non-empty array
  //       if (!roles || roles.length <= 0) {
  //         reject('getInfo: roles must be a non-null array!')
  //       }
  //
  //       commit('SET_ROLES', roles)
  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       commit('SET_INTRODUCTION', introduction)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  //
  // // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       commit('SET_TOKEN', '')
  //       commit('SET_ROLES', [])
  //       removeToken()
  //       resetRouter()
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  //
  // // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     commit('SET_TOKEN', '')
  //     commit('SET_ROLES', [])
  //     removeToken()
  //     resolve()
  //   })
  // },
  //
  // // dynamically modify permissions
  // changeRoles({ commit, dispatch }, role) {
  //   return new Promise(async resolve => {
  //     const token = role + '-token'
  //
  //     commit('SET_TOKEN', token)
  //     setToken(token)
  //
  //     const { roles } = await dispatch('getInfo')
  //
  //     resetRouter()
  //
  //     // generate accessible routes map based on roles
  //     const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
  //
  //     // dynamically add accessible routes
  //     router.addRoutes(accessRoutes)
  //
  //     // reset visited views and cached views
  //     dispatch('tagsView/delAllViews', null, { root: true })
  //
  //     resolve()
  //   })
  // }
}

export default {
  state,
  mutations,
  actions
}
