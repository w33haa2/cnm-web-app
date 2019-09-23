import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_VTO_LIST = generateMutationTypes(
  "BY ID",
  "FETCH_VTO_LIST"
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
  [FETCH_VTO_LIST.initial](state) {
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
  [FETCH_VTO_LIST.success](state, payload) {
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
  [FETCH_VTO_LIST.fail](state, payload) {
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
  fetchVtoList({ commit }, params) {
    const slug = "api.vto.list";
    STATE_API({ slug, params }, commit, [
      FETCH_VTO_LIST.initial,
      FETCH_VTO_LIST.success,
      FETCH_VTO_LIST.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
