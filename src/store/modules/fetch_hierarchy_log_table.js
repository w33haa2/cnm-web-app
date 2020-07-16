import { STATE_API } from "@/utils/api/api-helper";
import { generateMutationTypes } from "@/utils/api/state-mutation";
const FETCH_HIERARCHY_LOG_TABLE = generateMutationTypes(
    "LOGS",
    "FETCH_HIERARCHY_LOG_TABLE"
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
    [FETCH_HIERARCHY_LOG_TABLE.initial](state) {
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
    [FETCH_HIERARCHY_LOG_TABLE.success](state, payload) {
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
    [FETCH_HIERARCHY_LOG_TABLE.fail](state, payload) {
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
    fetchHierarchyLogsTable({ commit }, params) {
        const slug = "api.hierarchy_log.table";
        STATE_API({ slug, params }, commit, [
            FETCH_HIERARCHY_LOG_TABLE.initial,
            FETCH_HIERARCHY_LOG_TABLE.success,
            FETCH_HIERARCHY_LOG_TABLE.fail
        ]);
    }
};

export default {
    state,
    mutations,
    actions
};