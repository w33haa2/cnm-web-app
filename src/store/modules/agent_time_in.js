import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const AGENT_TIMEIN = generateMutationTypes(
  "AGENT",
  "AGENT_TIMEIN"
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
   * Commits initial state for DELETE INCOMING OT
   * @param state
   */
  [AGENT_TIMEIN.initial](state) {
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
  [AGENT_TIMEIN.success](state, payload) {
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
  [AGENT_TIMEIN.fail](state, payload) {
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
  agentTimeIn({ commit }, params) {
    const slug = "api.attendance.agent_timein";
    STATE_API({ slug, params }, commit, [
      AGENT_TIMEIN.initial,
      AGENT_TIMEIN.success,
      AGENT_TIMEIN.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
