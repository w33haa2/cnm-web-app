import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
import moment from "moment";
const FECTH_TODAYS_OT_SCHEDULE = generateMutationTypes("STICKY TIMEIN", "FECTH_TODAYS_OT_SCHEDULE");

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
   * Commits initial state for FETCH INCOMING OT
   * @param state
   */
  [FECTH_TODAYS_OT_SCHEDULE.initial](state) {
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
  [FECTH_TODAYS_OT_SCHEDULE.success](state, payload) {
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
  [FECTH_TODAYS_OT_SCHEDULE.fail](state, payload) {
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
   * Action for FETCH INCOMING OT
   * @param commit
   * @param params
   */
  fetchTodaysOvertimeSchedule({ commit }, params) {
    const slug = "api.overtime.search";
    STATE_API({ slug, params }, commit, [
      FECTH_TODAYS_OT_SCHEDULE.initial,
      FECTH_TODAYS_OT_SCHEDULE.success,
      FECTH_TODAYS_OT_SCHEDULE.fail
    ]);
  },
};

export default {
  state,
  mutations,
  actions
};
