import axios from 'axios'
const state = {
  employees: {
    data: [],
    rows: 0
  },
  accesslevels: [
    {
      'id': 1,
      'code': 'superadmin',
      'name': 'Admin',
      'parent': null
    },
    {
      'id': 2,
      'code': 'hrm',
      'name': 'HR Manager',
      'parent': 1
    },
    {
      'id': 3,
      'code': 'hrmassistant',
      'name': 'HR Assistant',
      'parent': 2
    },
    {
      'id': 4,
      'code': 'itsupervisor',
      'name': 'IT Supervisor',
      'parent': 1
    },
    {
      'id': 5,
      'code': 'itspecialist',
      'name': 'IT Specialist',
      'parent': 4
    },
    {
      'id': 6,
      'code': 'itsupport',
      'name': 'IT Support',
      'parent': 4
    },
    {
      'id': 7,
      'code': 'maintenancestaff',
      'name': 'Maintenance Staff',
      'parent': 2
    },
    {
      'id': 8,
      'code': 'tqmanager',
      'name': 'T & Q Manager',
      'parent': 1
    },
    {
      'id': 9,
      'code': 'producttrainer',
      'name': 'Product Trainer',
      'parent': 8
    },
    {
      'id': 10,
      'code': 'qasupervisor',
      'name': 'QA Supervisor',
      'parent': 8
    },
    {
      'id': 11,
      'code': 'qaanalyst',
      'name': 'Quality Assurance Analyst',
      'parent': 10
    },
    {
      'id': 12, // 12
      'code': 'rtamanager',
      'name': 'RTA Manager',
      'parent': 1
    },
    {
      'id': 13, // 13
      'code': 'rtasupervisor',
      'name': 'RTA Supervisor',
      'parent': 12
    },
    {
      'id': 14, // 14
      'code': 'rtaanalyst',
      'name': 'RTA Analyst',
      'parent': 13
    },
    {
      'id': 15, // 15
      'code': 'operationsmanager',
      'name': 'Operations Manager',
      'parent': 1
    },
    {
      'id': 16, // 16
      'code': 'teamleader',
      'name': 'Team Leader',
      'parent': 15
    },
    {
      'id': 17, // 17
      'code': 'representative_op',
      'name': 'Representative - Order Placer',
      'parent': 16
    },
    {
      'id': 18, // 18
      'code': 'accountant',
      'name': 'Accountant',
      'parent': 2
    },
    {
      'id': 19, // 19
      'code': 'financeofficer',
      'name': 'Finance Officer',
      'parent': 1
    },
    {
      'id': 20, // 20
      'code': 'payrollassistant',
      'name': 'Payroll Assistant',
      'parent': 19
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
  DEFINE_USERS: (state, employees) => {
    state.employees.data = employees.metadata
    state.employees.rows = employees.count
  },
  DEFINE_ACCESSLEVELS: (state, accesslevels) => (state.accesslevels = accesslevels),
  FORM_RESPONSE: (state, response) => (state.form_request_response = response)
  // DEFINE_RECENT_EMPLOYEES: (state, response) => (state.form_request_response = response),
}

const actions = {
  addErrorLog({ commit }, log) {
    commit('ADD_ERROR_LOG', log)
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG')
  },
  async fetchUsers({ commit }, query) {
    let endpoint = '/api/v1/users?'
    const params = []

    if (query.search.query) {
      endpoint = 'api/v1/users/search?query=' + query.search.query
      query.search.target.forEach((v, i) => {
        endpoint += '&target[]=' + v
      })
    }
    if (query.limit) {
      params.push('limit=' + query.limit)
    }
    if (query.offset) {
      params.push('offset=' + query.offset)
    }
    if (query.sort) {
      params.push('sort=' + query.sort)
    }
    if (query.order != null) {
      let order = 'asc'
      if (!query.order) {
        order = 'desc'
      }
      params.push('order=' + order)
    }
    if (params.length > 0) {
      params.forEach((v, i) => {
        endpoint += '&' + v
      })
    }
    alert(endpoint)

    const response = await axios.get(endpoint)
    // filter admin accounts with id no 1, 3
    const filtered = response.data.meta
    commit('DEFINE_USERS', filtered)
  },
  addUser({ commit }, employee) {
    const url = 'api/v1/users/create'
    axios.post(url, employee
      // ,
      // {
      // validateStatus:function(status){
      //   return true;
      // }
      // }
    )
      .then((res) => {
        this.dispatch('fetchUsers')
        console.log(res.status)
        commit('FORM_RESPONSE', res)
      })
      .catch((error) => {
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
