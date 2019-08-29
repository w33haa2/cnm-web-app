import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FECTH_AGENT_SCHEDULES = generateMutationTypes("CALENDAR DISPLAY", "FECTH_AGENT_SCHEDULES");

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
  errors: null,
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for FETCH AGENT SCHEDULES
   * @param state
   */
  [FECTH_AGENT_SCHEDULES.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for FETCH AGENT SCHEDULES
   * @param state
   */
  [FECTH_AGENT_SCHEDULES.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
  },
  /**
   * Commits fail state for FETCH AGENT SCHEDULES
   * @param state
   */
  [FECTH_AGENT_SCHEDULES.fail](state, payload) {
    state.state = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response.data.title;
  },
};

const actions = {
  /**
   * Action for FETCH AGENT SCHEDULES
   * @param commit
   * @param params
   */
  fetchAgentCalendar({ commit }, params) {
    const slug = "api.schedules.report";
    STATE_API({ slug, params }, commit, [
      FECTH_AGENT_SCHEDULES.initial,
      FECTH_AGENT_SCHEDULES.success,
      FECTH_AGENT_SCHEDULES.fail
    ]);
  },
};

export default {
  state,
  mutations,
  actions
};
