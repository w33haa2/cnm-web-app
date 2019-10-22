import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const TODAYS_SCHEDULE = generateMutationTypes("FOR TIME LOGGER", "TODAYS_SCHEDULE");

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
  title: null,
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for CANCEL LEAVE
   * @param state
   */
  [TODAYS_SCHEDULE.initial](state) {
    state.state = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for CANCEL LEAVE
   * @param state
   */
  [TODAYS_SCHEDULE.success](state, payload) {
    state.state = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    state.title = payload.title;
  },
  /**
   * Commits fail state for CANCEL LEAVE
   * @param state
   */
  [TODAYS_SCHEDULE.fail](state, payload) {
    state.state = {
      initial: false,
      success: false,
      fail: true
    };
    state.title = payload.response.data.title;
  },
};

const actions = {
  /**
   * Action for CANCEL LEAVE
   * @param commit
   * @param params
   */
  fetchTodaysSchedule({ commit }, params) {
    const slug = "api.schedules.today";
    STATE_API({ slug, params }, commit, [
      TODAYS_SCHEDULE.initial,
      TODAYS_SCHEDULE.success,
      TODAYS_SCHEDULE.fail
    ]);
  },
};

export default {
  state,
  mutations,
  actions
};
