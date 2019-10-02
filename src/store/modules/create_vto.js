import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CREATE_VTO = generateMutationTypes(
  "VTO",
  "CREATE_VTO"
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
   * Commits initial state for DELETE INCOMING OT
   * @param state
   */
  [CREATE_VTO.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for DELETE INCOMING OT
   * @param state
   */
  [CREATE_VTO.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for DELETE INCOMING OT
   * @param state
   */
  [CREATE_VTO.fail](state, payload) {
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
   * Action for DELETE INCOMING OT
   * @param commit
   * @param params
   */
  createVto({ commit }, params) {
    const slug = "api.vto.create";
    STATE_API({ slug, params }, commit, [
      CREATE_VTO.initial,
      CREATE_VTO.success,
      CREATE_VTO.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
