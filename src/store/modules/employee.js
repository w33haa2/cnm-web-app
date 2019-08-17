import axios from 'axios'
import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'

const FETCH_EMPLOYEES = generateMutationTypes('employees', 'FETCH_EMPLOYEES')
const DELETE_EMPLOYEES = generateMutationTypes('employees', 'DELETE_EMPLOYEES')
const UPDATE_EMPLOYEES = generateMutationTypes('employees', 'UPDATE_EMPLOYEES')
const ADD_EMPLOYEES = generateMutationTypes('employees', 'ADD_EMPLOYEES')
const FETCH_EMPLOYEES_RSEARCH = generateMutationTypes(
  'remote_search',
  'FETCH_EMPLOYEES'
)
const state = {
  employees: {
    data: [],
    rows: 0
  },
  employeesData: [],
  employeeErrors: '',
  employeeFetchState: {
    initial: false,
    success: false,
    fail: false
  },
  employeeDeleteState: {
    initial: false,
    success: false,
    fail: false
  },
  employeeCreateState: {
    initial: false,
    success: false,
    fail: false
  },
  employeeUpdateState: {
    initial: false,
    success: false,
    fail: false
  },
  employeesTotal: 0,
  rs_employees: {
    data: [],
    rows: 0
  },
  rs_employeesData: [],
  rs_employeeErrors: '',
  rs_employeeFetchState: {
    initial: false,
    success: false,
    fail: false
  },
  rs_employeeDeleteState: {
    initial: false,
    success: false,
    fail: false
  },
  rs_employeeUpdateState: {
    initial: false,
    success: false,
    fail: false
  },
  rs_employeesTotal: 0,
  accesslevels: [
    {
      id: 1,
      code: 'superadmin',
      name: 'Admin',
      parent: null
    },
    {
      id: 2,
      code: 'hrm',
      name: 'HR Manager',
      parent: 1
    },
    {
      id: 3,
      code: 'hrmassistant',
      name: 'HR Assistant',
      parent: 2
    },
    {
      id: 4,
      code: 'itsupervisor',
      name: 'IT Supervisor',
      parent: 1
    },
    {
      id: 5,
      code: 'itspecialist',
      name: 'IT Specialist',
      parent: 4
    },
    {
      id: 6,
      code: 'itsupport',
      name: 'IT Support',
      parent: 4
    },
    {
      id: 7,
      code: 'maintenancestaff',
      name: 'Maintenance Staff',
      parent: 2
    },
    {
      id: 8,
      code: 'tqmanager',
      name: 'T & Q Manager',
      parent: 1
    },
    {
      id: 9,
      code: 'producttrainer',
      name: 'Product Trainer',
      parent: 8
    },
    {
      id: 10,
      code: 'qasupervisor',
      name: 'QA Supervisor',
      parent: 8
    },
    {
      id: 11,
      code: 'qaanalyst',
      name: 'Quality Assurance Analyst',
      parent: 10
    },
    {
      id: 12, // 12
      code: 'rtamanager',
      name: 'RTA Manager',
      parent: 1
    },
    {
      id: 13, // 13
      code: 'rtasupervisor',
      name: 'RTA Supervisor',
      parent: 12
    },
    {
      id: 14, // 14
      code: 'rtaanalyst',
      name: 'RTA Analyst',
      parent: 13
    },
    {
      id: 15, // 15
      code: 'operationsmanager',
      name: 'Operations Manager',
      parent: 1
    },
    {
      id: 16, // 16
      code: 'teamleader',
      name: 'Team Leader',
      parent: 15
    },
    {
      id: 17, // 17
      code: 'representative_op',
      name: 'Representative - Order Placer',
      parent: 16
    },
    {
      id: 18, // 18
      code: 'accountant',
      name: 'Accountant',
      parent: 2
    },
    {
      id: 19, // 19
      code: 'financeofficer',
      name: 'Finance Officer',
      parent: 1
    },
    {
      id: 20, // 20
      code: 'payrollassistant',
      name: 'Payroll Assistant',
      parent: 19
    }
  ],
  form_request_response: [],
  recent_employees: []
}

const mutations = {
  // ADD_ERROR_LOG: (state, log) => {
  //     state.logs.push(log)
  // },
  // CLEAR_ERROR_LOG: (state) => {
  //   state.logs.splice(0)
  // }

  /**
   * Commits initial state for fetching employees
   * @param state
   */
  [FETCH_EMPLOYEES_RSEARCH.initial](state) {
    state.rs_employeeFetchState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching employees
   * @param state
   */
  [FETCH_EMPLOYEES_RSEARCH.success](state, payload) {
    state.rs_employeeFetchState = {
      initial: false,
      success: true,
      fail: false
    }
    state.rs_employeesData = payload.meta.metadata
    state.rs_employeesTotal = payload.meta.count
  },
  /**
   * Commits fail state for fetching employees
   * @param state
   */
  [FETCH_EMPLOYEES_RSEARCH.fail](state, payload) {
    state.rs_employeeFetchState = {
      initial: false,
      success: false,
      fail: true
    }
    state.rs_employeeErrors = payload.response.data.title
    state.rs_employeesData = []
    state.rs_employeesTotal = 0
  },
  DEFINE_USERS: (state, employees) => {
    state.employees.data = employees.metadata
    state.employees.rows = employees.count
  },
  DEFINE_ACCESSLEVELS: (state, accesslevels) =>
    (state.accesslevels = accesslevels),
  FORM_RESPONSE: (state, response) => (state.form_request_response = response),
  // DEFINE_RECENT_EMPLOYEES: (state, response) => (state.form_request_response = response),
  /**
   * Commits initial state for fetching employees
   * @param state
   */
  [FETCH_EMPLOYEES.initial](state) {
    state.employeeFetchState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching employees
   * @param state
   */
  [FETCH_EMPLOYEES.success](state, payload) {
    state.employeeFetchState = {
      initial: false,
      success: true,
      fail: false
    }
    state.employeesData = payload.meta.metadata
    state.employeesTotal = payload.meta.count
  },
  /**
   * Commits fail state for fetching employees
   * @param state
   */
  [FETCH_EMPLOYEES.fail](state, payload) {
    state.employeeFetchState = {
      initial: false,
      success: false,
      fail: true
    }
    state.employeeErrors = payload.response.data.title
    state.employeesData = []
    state.employeesTotal = 0
  },
  /**
   * Commits initial state for deleting employees
   * @param state
   */
  [DELETE_EMPLOYEES.initial](state) {
    state.employeeDeleteState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for deleting employees
   * @param state
   */
  [DELETE_EMPLOYEES.success](state) {
    state.employeeDeleteState = {
      initial: false,
      success: true,
      fail: false
    }
  },
  /**
   * Commits fail state for deleting employees
   * @param state
   */
  [DELETE_EMPLOYEES.fail](state, payload) {
    state.employeeDeleteState = {
      initial: false,
      success: false,
      fail: true
    }
    state.employeeErrors = payload.response.data.title
  },
  /**
   * Commits initial state for creating employees
   * @param state
   */
  [ADD_EMPLOYEES.initial](state) {
    state.employeeCreateState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for deleting employees
   * @param state
   */
  [ADD_EMPLOYEES.success](state) {
    state.employeeCreateState = {
      initial: false,
      success: true,
      fail: false
    }
  },
  /**
   * Commits fail state for deleting employees
   * @param state
   */
  [ADD_EMPLOYEES.fail](state, payload) {
    state.employeeCreateState = {
      initial: false,
      success: false,
      fail: true
    }
    state.employeeErrors = payload.response.data.title
  },
  /**
   * Commits initial state for deleting employees
   * @param state
   */
  [UPDATE_EMPLOYEES.initial](state) {
    state.employeeUpdateState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for deleting employees
   * @param state
   */
  [UPDATE_EMPLOYEES.success](state) {
    state.employeeUpdateState = {
      initial: false,
      success: true,
      fail: false
    }
  },
  /**
   * Commits fail state for deleting employees
   * @param state
   */
  [UPDATE_EMPLOYEES.fail](state, payload) {
    state.employeeUpdateState = {
      initial: false,
      success: false,
      fail: true
    }
    state.employeeErrors = payload.response.data.title
  }
}

const actions = {
  addErrorLog({ commit }, log) {
    commit('ADD_ERROR_LOG', log)
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG')
  },
  /**
   * Action for fetching employees
   * @param commit
   * @param params
   */
  fetchEmployees({ commit }, params) {
    const slug = 'api.users.fetchAll'
    params = params.data
    STATE_API({ slug, params }, commit, [
      FETCH_EMPLOYEES.initial,
      FETCH_EMPLOYEES.success,
      FETCH_EMPLOYEES.fail
    ])
  },

  fetchRSEmployees({ commit }, params) {
    const slug = 'api.users.fetchAll'
    params = params.data
    STATE_API({ slug, params }, commit, [
      FETCH_EMPLOYEES_RSEARCH.initial,
      FETCH_EMPLOYEES_RSEARCH.success,
      FETCH_EMPLOYEES_RSEARCH.fail
    ])
  },
  /**
   * Action for fetching employees
   * @param commit
   * @param params
   */
  deleteEmployee({ commit }, params) {
    const slug = 'api.users.delete'
    params = params.data
    STATE_API({ slug, params }, commit, [
      DELETE_EMPLOYEES.initial,
      DELETE_EMPLOYEES.success,
      DELETE_EMPLOYEES.fail
    ])
  },
  /**
   * Action for fetching employees
   * @param commit
   * @param params
   */
  changePassEmployee({ commit }, params) {
    const slug = 'api.users.change_pass'
    STATE_API({ slug, params }, commit, [
      UPDATE_EMPLOYEES.initial,
      UPDATE_EMPLOYEES.success,
      UPDATE_EMPLOYEES.fail
    ])
  },
  /**
   * Action for fetching employees
   * @param commit
   * @param params
   */
  resetPassEmployee({ commit }, params) {
    const slug = 'api.users.reset_pass'
    STATE_API({ slug, params }, commit, [
      UPDATE_EMPLOYEES.initial,
      UPDATE_EMPLOYEES.success,
      UPDATE_EMPLOYEES.fail
    ])
  },
  /**
   * Action for fetching employees
   * @param commit
   * @param params
   */
  addEmployee({ commit }, params) {
    const slug = 'api.users.create'
    console.log(params)
    STATE_API({ slug, params }, commit, [
      ADD_EMPLOYEES.initial,
      ADD_EMPLOYEES.success,
      ADD_EMPLOYEES.fail
    ])
  },
  addUser({ commit }, employee) {
    const url = 'api/v1/users/create'
    axios
      .post(url, employee)
      .then(res => {
        console.log(res.status)
        commit('FORM_RESPONSE', res)
      })
      .catch(error => {
        console.log(error)
        commit('FORM_RESPONSE', error.response)
      })

    console.log(response)
  },
  updateUser({ commit }, employee) {
    // const url = "api/v1/users/update/" + employee.get("id");

    const url = 'api/v1/users/create'
    // const url = "api/v1/users/create";
    axios
      .post(url, employee)
      .then(res => {
        this.dispatch('fetchUsers')
        console.log(res.status)
        commit('FORM_RESPONSE', res)
      })
      .catch(error => {
        console.log(error)
        commit('FORM_RESPONSE', error.response)
      })

    console.log(response)
  }
  // fetchRecentEmployees({ commit }) {
  //   const url = 'api/v1/users?sort=full_name&'
  // }
  // async fetchAccessLevels({commit}){
  //     const response = await axios.get('/api/v1/accesslevel');
  //     console.log(response)
  //     // commit('DEFINE_ACCESSLEVELS',response)
  // }
}

export default {
  state,
  mutations,
  actions
}
