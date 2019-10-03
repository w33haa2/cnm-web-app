import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_VTO = generateMutationTypes(
  "Table data",
  "FETCH_VTO"
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
   * Commits initial state for FETCH INCOMING OT
   * @param state
   */
  [FETCH_VTO.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for FETCH INCOMING OT
   * @param state
   */
  [FETCH_VTO.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for FETCH INCOMING OT
   * @param state
   */
  [FETCH_VTO.fail](state, payload) {
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
   * Action for FETCH INCOMING OT
   * @param commit
   * @param params
   */
  fetchVto({ commit }, params) {
    const slug = "api.vto.search";
    STATE_API({ slug, params }, commit, [
      FETCH_VTO.initial,
      FETCH_VTO.success,
      FETCH_VTO.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
