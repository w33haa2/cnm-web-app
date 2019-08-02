import { STATE_API } from '@/utils/api/api-helper'
import { generateMutationTypes } from '@/utils/api/state-mutation'
const FETCH_SANCTION_LEVELS = generateMutationTypes(
  'sanction_levels',
  'FETCH_SANCTION_LEVELS'
)
const CREATE_SANCTION_LEVELS = generateMutationTypes(
  'sanction_levels',
  'CREATE_SANCTION_LEVELS'
)
const UPDATE_SANCTION_LEVELS = generateMutationTypes(
  'sanction_levels',
  'UPDATE_SANCTION_LEVELS'
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
  createSanctionLevelState: {
    initial: false,
    success: false,
    fail: false
  },
  updateSanctionLevelState: {
    initial: false,
    success: false,
    fail: false
  },
  sanction_levels: [],
  sanctionLevelErrors: null
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
    state.sanctionLevelErrors = payload.response.data.title
  },
  /**
   * Commits initial state for creating sanction levels
   * @param state
   */
  [CREATE_SANCTION_LEVELS.initial](state) {
    state.createSanctionLevelState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for creating sanction levels
   * @param state
   */
  [CREATE_SANCTION_LEVELS.success](state) {
    state.createSanctionLevelState = {
      initial: false,
      success: true,
      fail: false
    }
  },
  /**
   * Commits fail state for creating sanction levels
   * @param state
   */
  [CREATE_SANCTION_LEVELS.fail](state, payload) {
    state.createSanctionLevelState = {
      initial: false,
      success: false,
      fail: true
    }
    state.sanctionLevelErrors = payload.response.data.title
  },
  /**
   * Commits initial state for update sanction levels
   * @param state
   */
  [UPDATE_SANCTION_LEVELS.initial](state) {
    state.updateSanctionLevelState = {
      initial: true,
      success: false,
      fail: false
    }
  },
  /**
   * Commits success state for update sanction levels
   * @param state
   */
  [UPDATE_SANCTION_LEVELS.success](state) {
    state.updateSanctionLevelState = {
      initial: false,
      success: true,
      fail: false
    }
  },
  /**
   * Commits fail state for update sanction levels
   * @param state
   */
  [UPDATE_SANCTION_LEVELS.fail](state, payload) {
    state.updateSanctionLevelState = {
      initial: false,
      success: false,
      fail: true
    }
    state.sanctionLevelErrors = payload.response.data.title
  }
}

const actions = {
  /**
   * Action for fetching sanction levels
   * @param commit
   * @param params
   */
  fetchSanctionLevels({ commit }, params) {
    const slug = 'api.sanction_levels.fetchAll'
    params = params.data
    STATE_API({ slug, params }, commit, [
      FETCH_SANCTION_LEVELS.initial,
      FETCH_SANCTION_LEVELS.success,
      FETCH_SANCTION_LEVELS.fail
    ])
  },
  /**
   * Action for creating sanction levels
   * @param commit
   * @param params
   */
  createSanctionLevels({ commit }, params) {
    const slug = 'api.sanction_levels.create'
    STATE_API({ slug, params }, commit, [
      CREATE_SANCTION_LEVELS.initial,
      CREATE_SANCTION_LEVELS.success,
      CREATE_SANCTION_LEVELS.fail
    ])
  },
  /**
   * Action for update sanction levels
   * @param commit
   * @param params
   */
  updateSanctionLevels({ commit }, params) {
    const slug = 'api.sanction_levels.update'
    STATE_API({ slug, params }, commit, [
      UPDATE_SANCTION_LEVELS.initial,
      UPDATE_SANCTION_LEVELS.success,
      UPDATE_SANCTION_LEVELS.fail
    ])
  }
}

export default {
  state,
  mutations,
  actions
}
