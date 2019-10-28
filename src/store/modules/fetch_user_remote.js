import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_USER_REMOTE = generateMutationTypes("REMOTE SEARCH", "FETCH_USER_REMOTE");

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
  [FETCH_USER_REMOTE.initial](state) {
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
  [FETCH_USER_REMOTE.success](state, payload) {
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
  [FETCH_USER_REMOTE.fail](state, payload) {
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
  fetchUserRemote({ commit }, params) {
    const slug = "api.users.remote";
    STATE_API({ slug, params }, commit, [
      FETCH_USER_REMOTE.initial,
      FETCH_USER_REMOTE.success,
      FETCH_USER_REMOTE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
