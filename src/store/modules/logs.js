import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'
const FETCH_LOGS = generateMutationTypes(
  'logs',
  'FETCH_LOGS'
)

/**
 * State
 */

const state = {
  fetchingLogState: {
    initial: false,
    success: false,
    fail: false
  },
  logs: [],
  errors: '',
}

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for fetching logs
   * @param state
   */
  [FETCH_LOGS.initial](state) {
    state.fetchingLogState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching logs
   * @param state
   */
  [FETCH_LOGS.success](state, payload) {
    state.fetchingLogState = {
      initial: false,
      success: true,
      fail: false
    }
    state.logs = payload.meta
  },
  /**
   * Commits fail state for fetching logs
   * @param state
   */
  [FETCH_LOGS.fail](state, payload) {
    state.fetchingLogState = {
      initial: false,
      success: false,
      fail: true
    }
    state.sanctionLevelErrors = payload.response.data.title
    state.logs.count = 0
    state.logs.metadata = []
  },
}

const actions = {
  /**
   * Action for fetching sanction levels
   * @param commit
   * @param params
   */
  fetchLogs({commit}, params) {
    const slug = 'api.logs.fetchAll'
    STATE_API({slug, params}, commit, [
      FETCH_LOGS.initial,
      FETCH_LOGS.success,
      FETCH_LOGS.fail
    ])
  },
}

export default {
  state,
  mutations,
  actions
}

