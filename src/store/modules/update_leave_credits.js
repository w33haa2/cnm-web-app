import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const UPDATE_LEAVE_CREDITS = generateMutationTypes(
  "BY ID",
  "UPDATE_LEAVE_CREDITS"
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
  [UPDATE_LEAVE_CREDITS.initial](state) {
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
  [UPDATE_LEAVE_CREDITS.success](state, payload) {
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
  [UPDATE_LEAVE_CREDITS.fail](state, payload) {
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
  updateLeaveCredits({ commit }, params) {
    const slug = "api.leave_credits.update";
    STATE_API({ slug, params }, commit, [
      UPDATE_LEAVE_CREDITS.initial,
      UPDATE_LEAVE_CREDITS.success,
      UPDATE_LEAVE_CREDITS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
