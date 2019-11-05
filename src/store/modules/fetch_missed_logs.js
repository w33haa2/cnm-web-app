import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FECTH_MISSEDLOGS = generateMutationTypes("TABLE", "FECTH_MISSEDLOGS");

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
  [FECTH_MISSEDLOGS.initial](state) {
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
  [FECTH_MISSEDLOGS.success](state, payload) {
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
  [FECTH_MISSEDLOGS.fail](state, payload) {
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
  fetchMissedLogs({ commit }, params) {
    const slug = "api.schedules.missed_logs";
    STATE_API({ slug, params }, commit, [
      FECTH_MISSEDLOGS.initial,
      FECTH_MISSEDLOGS.success,
      FECTH_MISSEDLOGS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
