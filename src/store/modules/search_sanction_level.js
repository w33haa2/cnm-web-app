import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const SEARCH_SANCTION_LEVELS = generateMutationTypes(
  "SANCTION_LEVEL",
  "SEARCH_SANCTION_LEVELS"
);

/**
 * State
 */

const state = {
  state: {
    initial: false,
    success: false,
    fail: false
  },
  data: [],
  errors: null
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for search sanction type
   * @param state
   */
  [SEARCH_SANCTION_LEVELS.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for search sanction type
   * @param state
   */
  [SEARCH_SANCTION_LEVELS.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for search sanction type
   * @param state
   */
  [SEARCH_SANCTION_LEVELS.fail](state, payload) {
    state.state = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response.data.title;
  }
};

const actions = {
  /**
   * Action for search ir
   * @param commit
   * @param params
   */
  searchSanctionTypes({ commit }, params) {
    const slug = "api.sanction_levels.search";
    STATE_API({ slug, params }, commit, [
      SEARCH_SANCTION_LEVELS.initial,
      SEARCH_SANCTION_LEVELS.success,
      SEARCH_SANCTION_LEVELS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
