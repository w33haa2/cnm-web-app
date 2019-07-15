import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'
const FETCH_SANCTION_LEVELS = generateMutationTypes(
  'sanction_levels',
  'FETCH_SANCTION_LEVELS'
)

/**
 * State
 */

const state = {
  fetchingSanctionLevelState: {
    initial: false,
    success: false,
    fail: false
  },
  sanction_levels: [],
  errors: null
}

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for fetching sanction levels
   * @param state
   */
  [FETCH_SANCTION_LEVELS.initial](state) {
    state.fetchingSanctionLevelState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching sanction levels
   * @param state
   */
  [FETCH_SANCTION_LEVELS.success](state, payload) {
    state.fetchingSanctionLevelState = {
      initial: false,
      success: true,
      fail: false
    }
    state.sanction_levels = payload.meta
    console.log(payload.meta)
  },
  /**
   * Commits fail state for fetching sanction levels
   * @param state
   */
  [FETCH_SANCTION_LEVELS.fail](state, payload) {
    state.fetchingSanctionLevelState = {
      initial: false,
      success: false,
      fail: true
    }
    state.errors = payload.response.data.title
  }
}

const actions = {
  /**
   * Action for fetching sanction levels
   * @param commit
   * @param params
   */
  fetchSanctionLevels({ commit }) {
    const slug = 'api.sanction_levels.fetchAll'
    STATE_API({ slug }, commit, [
      FETCH_SANCTION_LEVELS.initial,
      FETCH_SANCTION_LEVELS.success,
      FETCH_SANCTION_LEVELS.fail
    ])
  }
}

export default {
  state,
  mutations,
  actions
}
