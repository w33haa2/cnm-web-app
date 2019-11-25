import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const UPDATE_ACCESS_LEVEL = generateMutationTypes(
  "access_level",
  "UPDATE_ACCESS_LEVEL"
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
  title: null
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for FETCH INCOMING OT
   * @param state
   */
  [UPDATE_ACCESS_LEVEL.initial](state) {
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
  [UPDATE_ACCESS_LEVEL.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    state.title = payload.title;
  },
  /**
   * Commits fail state for FETCH INCOMING OT
   * @param state
   */
  [UPDATE_ACCESS_LEVEL.fail](state, payload) {
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
   * Action for FETCH INCOMING OT
   * @param commit
   * @param params
   */
  updateAccessLevel({ commit }, params) {
    const slug = "api.access_level.update";
    STATE_API({ slug, params }, commit, [
      UPDATE_ACCESS_LEVEL.initial,
      UPDATE_ACCESS_LEVEL.success,
      UPDATE_ACCESS_LEVEL.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
