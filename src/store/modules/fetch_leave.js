import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_LEAVES = generateMutationTypes("leaves", "FETCH_LEAVES");
const FETCH_PENDING_LEAVES = generateMutationTypes(
  "leaves",
  "FETCH_PENDING_LEAVES"
);
const FETCH_APPROVED_LEAVES = generateMutationTypes(
  "leaves",
  "FETCH_APPROVED_LEAVES"
);
const FETCH_DENIED_LEAVES = generateMutationTypes(
  "leaves",
  "FETCH_DENIED_LEAVES"
);

/**
 * State
 */

const state = {
  fetchingState: {
    all: {
      initial: false,
      success: false,
      fail: false
    },
    pending: {
      initial: false,
      success: false,
      fail: false
    },
    approved: {
      initial: false,
      success: false,
      fail: false
    },
    denied: {
      initial: false,
      success: false,
      fail: false
    }
  },
  data: {
    all: [],
    pending: [],
    approved: [],
    denied: []
  },
  errors: {
    all: null,
    pending: null,
    approved: null,
    denied: null
  }
};

/**
 * Mutators
 */
const mutations = {
  /**
   * Commits initial state for fetching leaves (ALL)
   * @param state
   */
  [FETCH_LEAVES.initial](state) {
    state.fetchingState.all = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetching leaves (ALL)
   * @param state
   */
  [FETCH_LEAVES.success](state, payload) {
    state.fetchingState.all = {
      initial: false,
      success: true,
      fail: false
    };
    state.data.all = payload.meta;
  },
  /**
   * Commits fail state for fetching leaves (ALL)
   * @param state
   */
  [FETCH_LEAVES.fail](state, payload) {
    state.fetchingState.all = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors.all = payload.response.data.title;
  },
  /**
   * Commits initial state for fetching leaves (PENDING)
   * @param state
   */
  [FETCH_PENDING_LEAVES.initial](state) {
    state.fetchingState.pending = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetching leaves (PENDING)
   * @param state
   */
  [FETCH_PENDING_LEAVES.success](state, payload) {
    state.fetchingState.pending = {
      initial: false,
      success: true,
      fail: false
    };
    state.data.pending = payload.meta;
  },
  /**
   * Commits fail state for fetching leaves (PENDING)
   * @param state
   */
  [FETCH_PENDING_LEAVES.fail](state, payload) {
    state.fetchingState.pending = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors.pending = payload.response.data.title;
  },
  /**
   * Commits initial state for fetching leaves (APPROVED)
   * @param state
   */
  [FETCH_APPROVED_LEAVES.initial](state) {
    state.fetchingState.approved = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetching leaves (APPROVED)
   * @param state
   */
  [FETCH_APPROVED_LEAVES.success](state, payload) {
    state.fetchingState.approved = {
      initial: false,
      success: true,
      fail: false
    };
    state.data.approved = payload.meta;
  },
  /**
   * Commits fail state for fetching leaves (APPROVED)
   * @param state
   */
  [FETCH_APPROVED_LEAVES.fail](state, payload) {
    state.fetchingState.approved = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors.approved = payload.response.data.title;
  },
  /**
   * Commits initial state for fetching leaves (DENIED)
   * @param state
   */
  [FETCH_DENIED_LEAVES.initial](state) {
    state.fetchingState.denied = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetching leaves (DENIED)
   * @param state
   */
  [FETCH_DENIED_LEAVES.success](state, payload) {
    state.fetchingState.denied = {
      initial: false,
      success: true,
      fail: false
    };
    state.data.denied = payload.meta;
  },
  /**
   * Commits fail state for fetching leaves (DENIED)
   * @param state
   */
  [FETCH_DENIED_LEAVES.fail](state, payload) {
    state.fetchingState.denied = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors.denied = payload.response.data.title;
  }
};

const actions = {
  /**
   * Action for fetching leaves (ALL)
   * @param commit
   * @param params
   */
  fetchLeave({ commit }, params) {
    const slug = "api.leaves.fetchAll";
    STATE_API({ slug, params }, commit, [
      FETCH_LEAVES.initial,
      FETCH_LEAVES.success,
      FETCH_LEAVES.fail
    ]);
  },
  /**
   * Action for fetching leaves (PENDING)
   * @param commit
   * @param params
   */
  fetchPendingLeave({ commit }, params) {
    const slug = "api.leaves.fetchAll";
    params.status = "pending";
    STATE_API({ slug, params }, commit, [
      FETCH_PENDING_LEAVES.initial,
      FETCH_PENDING_LEAVES.success,
      FETCH_PENDING_LEAVES.fail
    ]);
  },
  /**
   * Action for fetching leaves (APPROVED)
   * @param commit
   * @param params
   */
  fetchApprovedLeave({ commit }, params) {
    const slug = "api.leaves.fetchAll";
    params.status = "approved";
    STATE_API({ slug, params }, commit, [
      FETCH_APPROVED_LEAVES.initial,
      FETCH_APPROVED_LEAVES.success,
      FETCH_APPROVED_LEAVES.fail
    ]);
  },
  /**
   * Action for fetching leaves (DENIED)
   * @param commit
   * @param params
   */
  fetchDeniedLeave({ commit }, params) {
    const slug = "api.leaves.fetchAll";
    params.status = "denied";
    STATE_API({ slug, params }, commit, [
      FETCH_DENIED_LEAVES.initial,
      FETCH_DENIED_LEAVES.success,
      FETCH_DENIED_LEAVES.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
