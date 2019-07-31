import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'
const FETCH_SANCTION_TYPES = generateMutationTypes(
  'sanction_types',
  'FETCH_SANCTION_TYPES'
)

/**
 * State
 */

const state = {
  fetchingSanctionTypeState: {
    initial: false,
    success: false,
    fail: false
  },
  sanction_types: [],
  sanctionTypeTotal: 0,
  errors: null
}

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for fetching sanction types
   * @param state
   */
  [FETCH_SANCTION_TYPES.initial](state) {
    state.fetchingSanctionTypeState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for fetching sanction types
   * @param state
   */
  [FETCH_SANCTION_TYPES.success](state, payload) {
    state.fetchingSanctionTypeState = {
      initial: false,
      success: true,
      fail: false
    }
    state.sanction_types = payload.meta
    console.log(state.sanction_types)
    state.sanctionTypeTotal = payload.meta.count
  },
  /**
   * Commits fail state for fetching sanction types
   * @param state
   */
  [FETCH_SANCTION_TYPES.fail](state, payload) {
    state.fetchingSanctionTypeState = {
      initial: false,
      success: false,
      fail: true
    }
    state.errors = payload.response.data.title
  }
}

const actions = {
  /**
   * Action for fetching sanction types
   * @param commit
   * @param params
   */
  fetchSanctionTypes({ commit }) {
    const slug = 'api.sanction_types.fetchAll'
    STATE_API({ slug }, commit, [
      FETCH_SANCTION_TYPES.initial,
      FETCH_SANCTION_TYPES.success,
      FETCH_SANCTION_TYPES.fail
    ])
  }
}

export default {
  state,
  mutations,
  actions
}
