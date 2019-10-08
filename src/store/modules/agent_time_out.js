import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const AGENT_TIMEOUT = generateMutationTypes(
  "AGENT",
  "AGENT_TIMEOUT"
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
  [AGENT_TIMEOUT.initial](state) {
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
  [AGENT_TIMEOUT.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    state.title = payload.title;

  },
  /**
   * Commits fail state for DELETE INCOMING OT
   * @param state
   */
  [AGENT_TIMEOUT.fail](state, payload) {
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
   * Action for DELETE INCOMING OT
   * @param commit
   * @param params
   */
  agentTimeOut({ commit }, params) {
    const slug = "api.attendance.agent_timeout";
    STATE_API({ slug, params }, commit, [
      AGENT_TIMEOUT.initial,
      AGENT_TIMEOUT.success,
      AGENT_TIMEOUT.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
