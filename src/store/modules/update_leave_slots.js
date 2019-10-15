import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const UPDATE_ATTENDANCE = generateMutationTypes(
  "SINGLE",
  "UPDATE_ATTENDANCE"
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
  [UPDATE_ATTENDANCE.initial](state) {
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
  [UPDATE_ATTENDANCE.success](state, payload) {
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
  [UPDATE_ATTENDANCE.fail](state, payload) {
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
  updateAttendance({ commit }, params) {
    const slug = "api.leave_slots.update";
    STATE_API({ slug, params }, commit, [
      UPDATE_ATTENDANCE.initial,
      UPDATE_ATTENDANCE.success,
      UPDATE_ATTENDANCE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
