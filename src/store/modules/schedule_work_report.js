import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'
const ALL_AGENTS_REPORTS = generateMutationTypes(
  'all_agents_work_reports',
  'ALL_AGENTS_REPORTS'
)

/**
 * State
 */

const state = {
  fetchingState: {
    initial: false,
    success: false,
    fail: false
  },
  data: [],
  errors: null
}

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [ALL_AGENTS_REPORTS.initial](state) {
    state.fetchingState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [ALL_AGENTS_REPORTS.success](state, payload) {
    state.fetchingState = {
      initial: false,
      success: true,
      fail: false
    }
    state.data = payload.meta
    console.log(payload.meta)
  },
  /**
   * Commits fail state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [ALL_AGENTS_REPORTS.fail](state, payload) {
    state.fetchingState = {
      initial: false,
      success: false,
      fail: true
    }
    state.errors = payload.response.data.title
  }
}

const actions = {
  /**
   * Action for fetching AGENTS WORK REPORTS
   * @param commit
   * @param params
   */
  fetchAgentsWorkReports({ commit }, params) {
    const slug = 'api.schedules.work'
    params = params.data
    STATE_API({ slug, params }, commit, [
      ALL_AGENTS_REPORTS.initial,
      ALL_AGENTS_REPORTS.success,
      ALL_AGENTS_REPORTS.fail
    ])
  }
}

export default {
  state,
  mutations,
  actions
}
