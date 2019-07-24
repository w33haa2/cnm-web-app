import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'
const FETCH_INCIDENT_REPORTS = generateMutationTypes(
  'incident_reports',
  'FETCH_INCIDENT_REPORTS'
)
const CREATE_INCIDENT_REPORTS = generateMutationTypes(
  'incident_reports',
  'FETCH_INCIDENT_REPORTS'
)
const FETCH_ISSUED_INCIDENT_REPORTS = generateMutationTypes(
  'incident_reports',
  'FETCH_ISSUED_INCIDENT_REPORTS'
)
const FETCH_RECEIVED_INCIDENT_REPORTS = generateMutationTypes(
  'incident_reports',
  'FETCH_RECEIVED_INCIDENT_REPORTS'
)

/**
 * State
 */

const state = {
  fetchingIRState: {
    initial: false,
    success: false,
    fail: false
  },
  creatingIRState: {
    initial: false,
    success: false,
    fail: false
  },
  fetchingIssuedIRState: {
    initial: false,
    success: false,
    fail: false
  },
  fetchingReceivedIRState: {
    initial: false,
    success: false,
    fail: false
  },
  reports: [],
  reports_total: 0,
  errors: null
}

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for fetching incident reports
   * @param state
   */
  [FETCH_INCIDENT_REPORTS.initial](state) {
    state.fetchingIRState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching incident reports
   * @param state
   */
  [FETCH_INCIDENT_REPORTS.success](state, payload) {
    state.fetchingIRState = {
      initial: false,
      success: true,
      fail: false
    }
    state.reports = payload.meta.all_reports
  },
  /**
   * Commits fail state for fetching incident reports
   * @param state
   */
  [FETCH_INCIDENT_REPORTS.fail](state, payload) {
    state.fetchingIRState = {
      initial: false,
      success: false,
      fail: true
    }
    state.errors = payload.response.data.title
    state.reports = []
    state.reports_total = 0
  },
  /**
   * Commits initial state for fetching incident reports
   * @param state
   */
  [FETCH_ISSUED_INCIDENT_REPORTS.initial](state) {
    state.fetchingIssuedIRState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching incident reports
   * @param state
   */
  [FETCH_ISSUED_INCIDENT_REPORTS.success](state, payload) {
    state.fetchingIssuedIRState = {
      initial: false,
      success: true,
      fail: false
    }
    state.reports = payload.meta.reports
    state.reports_total = payload.meta.count
  },
  /**
   * Commits fail state for fetching incident reports
   * @param state
   */
  [FETCH_ISSUED_INCIDENT_REPORTS.fail](state, payload) {
    state.fetchingIssuedIRState = {
      initial: false,
      success: false,
      fail: true
    }
    state.errors = payload.response.data.title
    state.reports = []
    state.reports_total = 0
  },
  /**
   * Commits initial state for fetching incident reports
   * @param state
   */
  [FETCH_RECEIVED_INCIDENT_REPORTS.initial](state) {
    state.fetchingReceivedIRState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching incident reports
   * @param state
   */
  [FETCH_RECEIVED_INCIDENT_REPORTS.success](state, payload) {
    state.fetchingReceivedIRState = {
      initial: false,
      success: true,
      fail: false
    }
    state.reports = payload.meta.reports
    state.reports_total = payload.meta.count
  },
  /**
   * Commits fail state for fetching incident reports
   * @param state
   */
  [FETCH_RECEIVED_INCIDENT_REPORTS.fail](state, payload) {
    state.fetchingReceivedIRState = {
      initial: false,
      success: false,
      fail: true
    }
    state.errors = payload.response.data.title
    state.reports = []
    state.reports_total = 0
  },
  /**
   * Commits initial state for fetching incident reports
   * @param state
   */
  [CREATE_INCIDENT_REPORTS.initial](state) {
    state.creatingIRState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching incident reports
   * @param state
   */
  [CREATE_INCIDENT_REPORTS.success](state, payload) {
    state.creatingIRState = {
      initial: false,
      success: true,
      fail: false
    }
  },
  /**
   * Commits fail state for fetching incident reports
   * @param state
   */
  [CREATE_INCIDENT_REPORTS.fail](state, payload) {
    state.creatingIRState = {
      initial: false,
      success: false,
      fail: true
    }
    state.errors = payload.response.data.title
  }
}

const actions = {
  /**
   * Action for fetching incident reports
   * @param commit
   * @param params
   */
  fetchReports({ commit }, params) {
    const slug = 'api.reports.fetchAll'
    STATE_API({ slug, params }, commit, [
      FETCH_INCIDENT_REPORTS.initial,
      FETCH_INCIDENT_REPORTS.success,
      FETCH_INCIDENT_REPORTS.fail
    ])
  },
  /**
   * Action for creating reports
   * @param commit
   * @param params
   */
  createReports({ commit }, params) {
    const slug = 'api.reports.create'
    STATE_API({ slug, params }, commit, [
      CREATE_INCIDENT_REPORTS.initial,
      CREATE_INCIDENT_REPORTS.success,
      CREATE_INCIDENT_REPORTS.fail
    ])
  },
  /**
   * Action for fetching incident reports
   * @param commit
   * @param params
   */
  fetchIssuedReports({ commit }, params) {
    const slug = 'api.reports.issuedBy'
    STATE_API({ slug, params }, commit, [
      FETCH_ISSUED_INCIDENT_REPORTS.initial,
      FETCH_ISSUED_INCIDENT_REPORTS.success,
      FETCH_ISSUED_INCIDENT_REPORTS.fail
    ])
  },
  /**
   * Action for fetching incident reports
   * @param commit
   * @param params
   */
  fetchReceivedReports({ commit }, params) {
    const slug = 'api.reports.issuedTo'
    STATE_API({ slug, params }, commit, [
      FETCH_RECEIVED_INCIDENT_REPORTS.initial,
      FETCH_RECEIVED_INCIDENT_REPORTS.success,
      FETCH_RECEIVED_INCIDENT_REPORTS.fail
    ])
  }
}

export default {
  state,
  mutations,
  actions
}
