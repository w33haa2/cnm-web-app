import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const ALL_AGENTS_REPORTS = generateMutationTypes(
  "all_agents_work_reports",
  "ALL_AGENTS_REPORTS"
);
const CREATE_SCHEDULE = generateMutationTypes(
  "schedule_work_report",
  "CREATE_SCHEDULE"
);

/**
 * State
 */

const state = {
  fetchingState: {
    initial: false,
    success: false,
    fail: false
  },
  creatingState: {
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
   * Commits initial state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [ALL_AGENTS_REPORTS.initial](state) {
    state.fetchingState = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [ALL_AGENTS_REPORTS.success](state, payload) {
    state.fetchingState = {
      initial: false,
      success: true,
      fail: false
    };
    state.data = payload.meta;
    // console.log(payload.meta)
  },
  /**
   * Commits fail state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [ALL_AGENTS_REPORTS.fail](state, payload) {
    state.fetchingState = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response.data.title;
  },
  /**
   * Commits initial state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [CREATE_SCHEDULE.initial](state) {
    state.creatingState = {
      initial: true,
      success: false,
      fail: false
    };
  },
  /**
   * Commits success state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [CREATE_SCHEDULE.success](state, payload) {
    state.creatingState = {
      initial: false,
      success: true,
      fail: false
    };
  },
  /**
   * Commits fail state for fetching ALL AGENTS WORK REPORTS
   * @param state
   */
  [CREATE_SCHEDULE.fail](state, payload) {
    state.creatingState = {
      initial: false,
      success: false,
      fail: true
    };
    state.errors = payload.response.data.title;
  }
};

const actions = {
  /**
   * Action for fetching AGENTS WORK REPORTS
   * @param commit
   * @param params
   */
  fetchAgentsWorkReports({ commit }, params) {
    const slug = "api.schedules.report";
    params = params.data;
    STATE_API({ slug, params }, commit, [
      ALL_AGENTS_REPORTS.initial,
      ALL_AGENTS_REPORTS.success,
      ALL_AGENTS_REPORTS.fail
    ]);
  },
  /**
   * Action for creating AGENTS WORK REPORTS
   * @param commit
   * @param params
   */
  createBulkSchedule({ commit }, params) {
    const slug = "api.schedules.create.bulk.data";
    STATE_API({ slug, params }, commit, [
      CREATE_SCHEDULE.initial,
      CREATE_SCHEDULE.success,
      CREATE_SCHEDULE.fail
    ]);
  }
};

export default {
  state,
  mutations,
  actions
};
