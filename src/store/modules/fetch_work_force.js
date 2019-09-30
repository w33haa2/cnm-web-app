import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_WORK_FORCE_DATA = generateMutationTypes("work force", "FETCH_WORK_FORCE_DATA");

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
  [FETCH_WORK_FORCE_DATA.initial](state) {
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
  [FETCH_WORK_FORCE_DATA.success](state, payload) {
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
  [FETCH_WORK_FORCE_DATA.fail](state, payload) {
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
  fetchWorkForce({ commit }, params) {
    const slug = "api.users.fetchAll";
    STATE_API({ slug, params }, commit, [
      FETCH_WORK_FORCE_DATA.initial,
      FETCH_WORK_FORCE_DATA.success,
      FETCH_WORK_FORCE_DATA.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
