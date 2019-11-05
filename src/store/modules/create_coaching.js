import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const CREATE_COACHING = generateMutationTypes("Coaching", "CREATE_COACHING");

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
  title: null
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for COACHING
   * @param state
   */
  [CREATE_COACHING.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for COACHING
   * @param state
   */
  [CREATE_COACHING.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    state.title = payload.title;
  },
  /**
   * Commits fail state for COACHING
   * @param state
   */
  [CREATE_COACHING.fail](state, payload) {
    state.state = {
      initial: false,
      success: false,
      fail: true
    };
    state.title = payload.response.data.title;
  }
};

const actions = {
  /**
   * Action for COACHING
   * @param commit
   * @param params
   */
  createCoaching({ commit }, params) {
    const slug = "api.coaching.create";
    STATE_API({ slug, params }, commit, [
      CREATE_COACHING.initial,
      CREATE_COACHING.success,
      CREATE_COACHING.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
