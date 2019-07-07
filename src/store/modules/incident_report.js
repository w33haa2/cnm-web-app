import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'
const FETCH_INCIDENT_REPORTS = generateMutationTypes('incident_reports', 'FETCH_INCIDENT_REPORTS')

/**
 * State
 */

const state = {
  fetchingIRState: {
    initial: false,
    success: false,
    fail: false
  },
  reports: [],
  errors: null,
}

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for fetching incident reports
   * @param state
   */
  [FETCH_INCIDENT_REPORTS.initial] (state) {
    state.fetchingIRState = {
      initial: true,
      success: false,
      fail: false,
    }
  },
  /**
   * Commits success state for fetching incident reports
   * @param state
   */
  [FETCH_INCIDENT_REPORTS.success] (state,payload) {
    state.fetchingIRState = {
      initial: false,
      success: true,
      fail: false,
    }
    state.reports = payload.meta
  },
  /**
   * Commits fail state for fetching incident reports
   * @param state
   */
  [FETCH_INCIDENT_REPORTS.fail] (state,payload) {
    state.fetchingIRState = {
      initial: false,
      success: false,
      fail: true,
    }
    state.errors = payload.response.data.title
  },
}

const actions = {
  /**
   * Action for fetching incident reports
   * @param commit
   * @param params
   */
  fetchReports ({commit}) {
    const slug = 'api.reports.fetchAll'
    STATE_API({slug}, commit, [FETCH_INCIDENT_REPORTS.initial, FETCH_INCIDENT_REPORTS.success, FETCH_INCIDENT_REPORTS.fail])
  },
}

export default {
  state,
  mutations,
  actions
}