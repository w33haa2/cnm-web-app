import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const SEARCH_SANCTION_TYPES = generateMutationTypes(
  "SANCTION_TYPE",
  "SEARCH_SANCTION_TYPES"
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
  [SEARCH_SANCTION_TYPES.initial](state) {
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
  [SEARCH_SANCTION_TYPES.success](state, payload) {
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
  [SEARCH_SANCTION_TYPES.fail](state, payload) {
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
    const slug = "api.sanction_types.search";
    STATE_API({ slug, params }, commit, [
      SEARCH_SANCTION_TYPES.initial,
      SEARCH_SANCTION_TYPES.success,
      SEARCH_SANCTION_TYPES.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
