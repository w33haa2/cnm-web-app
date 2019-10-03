import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CANCEL_VTO = generateMutationTypes(
  "Table data",
  "CANCEL_VTO"
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
  [CANCEL_VTO.initial](state) {
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
  [CANCEL_VTO.success](state, payload) {
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
  [CANCEL_VTO.fail](state, payload) {
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
   * Action for CANCEL INCOMING OT
   * @param commit
   * @param params
   */
  cancelVto({ commit }, params) {
    const slug = "api.vto.cancel";
    STATE_API({ slug, params }, commit, [
      CANCEL_VTO.initial,
      CANCEL_VTO.success,
      CANCEL_VTO.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
