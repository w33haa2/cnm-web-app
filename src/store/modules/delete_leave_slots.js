import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const DELETE_LEAVE_SLOTS = generateMutationTypes(
  "SINGLE",
  "DELETE_LEAVE_SLOTS"
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
  [DELETE_LEAVE_SLOTS.initial](state) {
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
  [DELETE_LEAVE_SLOTS.success](state, payload) {
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
  [DELETE_LEAVE_SLOTS.fail](state, payload) {
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
  deleteLeaveSlots({ commit }, params) {
    const slug = "api.leave_slots.delete";
    STATE_API({ slug, params }, commit, [
      DELETE_LEAVE_SLOTS.initial,
      DELETE_LEAVE_SLOTS.success,
      DELETE_LEAVE_SLOTS.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
