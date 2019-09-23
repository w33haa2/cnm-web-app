const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.userDetails.image_url,
  gender: state => state.user.userDetails.gender,
  name: state => state.user.userDetails.full_name,
  user_id: state => state.user.userDetails.id,
  head_access_id: state => state.user.userDetails.head,
  head_id: state => state.user.userDetails.parent_id,
  introduction: state => state.user.introduction,
  roles: state => state.user.userDetails.position,
  position_id: state => state.user.userDetails.position_id,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,

  // incident reports
  fetchingIncidentReports: state => state.incident_report.fetchingIRState,
  fetchingAllIncidentReports: state => state.incident_report.fetchingAllIRState,
  creatingIncidentReports: state => state.incident_report.creatingIRState,
  updateIncidentReportState: state => state.update_incident_report.state,
  fetchingIssuedIncidentReports: state =>
    state.incident_report.fetchingIssuedIRState,
  fetchingReceivedIncidentReports: state =>
    state.incident_report.fetchingReceivedIRState,
  incidentReports: state => state.incident_report.reports,
  incidentReportsTotal: state => state.incident_report.reports_total,
  irErrors: state => state.incident_report.errors,
  issuedToSearchData: state => state.search_issued_to_ir.data,
  issuedToSearchState: state => state.search_issued_to_ir.state,
  issuedBySearchData: state => state.search_issued_by_ir.data,
  issuedBySearchState: state => state.search_issued_by_ir.state,

  // employee module
  employees: state => state.employee.employees,
  rs_employees: state => state.employee.rs_employeesData,
  userDetails: state => state.user.userDetails,
  comrades: state => state.user.comrades,
  comradesTotal: state => state.user.comradesTotal,
  employeesData: state => state.employee.employeesData,
  employeesTotal: state => state.employee.employeesTotal,
  employeeErrors: state => state.employee.employeeErrors,
  employeeFetchState: state => state.employee.employeeFetchState,
  employeeCreateState: state => state.employee.employeeCreateState,
  fetchingComradeState: state => state.employee.fetchingComradeState,
  employeeDeleteState: state => state.employee.employeeDeleteState,
  employeeUpdateState: state => state.employee.employeeUpdateState,
  allPosition: state => state.employee.accesslevels,
  formResponse: state => state.employee.form_request_response,
  changeStatusState: state => state.employee.employeeChangeStatusState,
  resetPassState: state => state.employee.employeeResetPassState,

  // user module
  position: state => state.user.userDetails.position,
  statusList: state => state.user.data.statusList,
  statusListCount: state => state.user.count.statusList,
  statusListState: state => state.user.fetchState.statusList,
  potentialHead: state => state.user.data.potentialHead,
  loginState: state => state.user.loggingInState,
  fetchStateStatusList: state => state.user.fetchState.statusList,
  fetchStatePotentialHead: state => state.user.fetchState.potentialHead,

  // sanction level module
  sanctionLevels: state => state.sanction_level.sanction_levels,
  sanctionLevelsSearch: state => state.search_sanction_level.data,
  sanctionLevelsSearchState: state => state.search_sanction_level.state,
  sanctionLevelErrors: state => state.sanction_level.sanctionLevelErrors,
  sanctionTypes: state => state.sanction_type.sanction_types,
  sanctionTypesSearch: state => state.search_sanction_type.data,
  sanctionTypesSearchState: state => state.search_sanction_type.state,
  sanctionTypeErrors: state => state.sanction_type.sanctionTypeErrors,
  // =============== end data
  // region logs
  logs: state => state.logs.logs,
  fetchingLogState: state => state.logs.fetchingLogState,
  logErrors: state => state.logs.errors,
  logsSearchData: state => state.search_action_log.data,
  logsSearchState: state => state.search_action_log.state,
  // endregion logs
  // =============== start state
  fetchSanctionLevelState: state =>
    state.sanction_level.fetchingSanctionLevelState,
  createSanctionLevelState: state =>
    state.sanction_level.createSanctionLevelState,
  updateSanctionLevelState: state =>
    state.sanction_level.updateSanctionLevelState,
  fetchSanctionTypeState: state =>
    state.sanction_type.fetchingSanctionTypeState,
  createSanctionTypeState: state => state.sanction_type.createSanctionTypeState,
  updateSanctionTypeState: state => state.sanction_type.updateSanctionTypeState,
  // =============== end state
  // END
  // store/modules/sanction
  // =================================================================
  // schedule_work_report module
  agentsWorkReports: state => state.schedule_work_report.data,
  agentsWorkReportsfetchState: state =>
    state.schedule_work_report.fetchingState,
  // agent_list
  agents: state => state.agent_list.data,
  agentsfetchState: state => state.agent_list.fetchingState,
  // fetch_leave
  leaves: state => state.fetch_leave.data.all,
  leavesfetchState: state => state.fetch_leave.fetchingState.all,
  leavesPending: state => state.fetch_leave.data.pending,
  leavesPendingfetchState: state => state.fetch_leave.fetchingState.pending,
  leavesApproved: state => state.fetch_leave.data.approved,
  leavesApprovedfetchState: state => state.fetch_leave.fetchingState.approved,
  leavesDenied: state => state.fetch_leave.data.denied,
  leavesDeniedfetchState: state => state.fetch_leave.fetchingState.denied,
  // delete_leave
  deleteLeaveData: state => state.delete_leave.data,
  deleteLeaveState: state => state.delete_leave.state,
  //create_leave
  createLeaveData: state => state.create_leave.data,
  createLeaveState: state => state.create_leave.state,
  createLeaveError: state => state.create_leave.errors,
  createLeaveParams: state => state.create_leave.params,
  //update_leave
  updateLeaveData: state => state.update_leave.data,
  updateLeaveState: state => state.update_leave.state,
  // agent daily work
  todaysWork: state => state.agent_daily_work.data,
  todaysWorkfetchState: state => state.agent_daily_work.fetchingState,
  // agent_start_work
  agentStartWorkData: state => state.agent_start_work.data,
  agentStartWorkfetchState: state => state.agent_start_work.fetchingState,
  // agent_end_work
  agentEndWorkData: state => state.agent_start_work.data,
  agentEndWorkfetchState: state => state.agent_start_work.fetchingState,
  // create report response
  createReportResponseState: state => state.create_report_response.state,
  createReportResponseData: state => state.create_report_response.data,
  // update report response
  updateReportResponseState: state => state.update_report_response.state,
  updateReportResponseData: state => state.update_report_response.data,
  // create_user_status
  createUserStatusState: state => state.create_user_status.state,
  createUserStatusData: state => state.create_user_status.data,
  createUserStatusError: state => state.create_user_status.errors,
  // update_user_status
  updateUserStatusState: state => state.update_user_status.state,
  updateUserStatusData: state => state.update_user_status.data,
  updateUserStatusError: state => state.update_user_status.errors,
  // delete_user_status
  deleteUserStatusState: state => state.delete_user_status.state,
  deleteUserStatusData: state => state.delete_user_status.data,
  deleteUserStatusError: state => state.delete_user_status.errors,
  // agent_calendar
  fetchAgentCalendarState: state => state.agent_calendar.state,
  fetchAgentCalendarData: state => state.agent_calendar.data,
  fetchAgentCalendarError: state => state.agent_calendar.errors,
  // fecth_overtime_schedule
  fetchOvertimeScheduleState: state => state.fetch_overtime_schedule.state,
  fetchOvertimeScheduleData: state => state.fetch_overtime_schedule.data,
  fetchOvertimeScheduleError: state => state.fetch_overtime_schedule.errors,
  // search_overtime_schedule
  searchOvertimeScheduleState: state => state.search_overtime_schedule.state,
  searchOvertimeScheduleData: state => state.search_overtime_schedule.data,
  searchOvertimeScheduleError: state => state.search_overtime_schedule.errors,
  // create_overtime_schedule
  createOvertimeScheduleState: state => state.create_overtime_schedule.state,
  createOvertimeScheduleData: state => state.create_overtime_schedule.data,
  createOvertimeScheduleError: state => state.create_overtime_schedule.errors,
  // update_overtime_schedule
  updateOvertimeScheduleState: state => state.update_overtime_schedule.state,
  updateOvertimeScheduleData: state => state.update_overtime_schedule.data,
  updateOvertimeScheduleError: state => state.update_overtime_schedule.errors,
  // delete_overtime_schedule
  deleteOvertimeScheduleState: state => state.delete_overtime_schedule.state,
  deleteOvertimeScheduleData: state => state.delete_overtime_schedule.data,
  deleteOvertimeScheduleError: state => state.delete_overtime_schedule.errors,
  // fetch_todays_overtime_schedule
  fetchTodaysOvertimeScheduleState: state =>
    state.fetch_todays_overtime_schedule.state,
  fetchTodaysOvertimeScheduleData: state =>
    state.fetch_todays_overtime_schedule.data,
  fetchTodaysOvertimeScheduleError: state =>
    state.fetch_todays_overtime_schedule.errors,
  // join_overtime_schedule
  joinOvertimeScheduleState: state => state.join_overtime_schedule.state,
  joinOvertimeScheduleData: state => state.join_overtime_schedule.data,
  joinOvertimeScheduleError: state => state.join_overtime_schedule.errors,
  // fetch_leave_credits
  fetchLeaveCreditsState: state => state.fetch_leave_credits.state,
  fetchLeaveCreditsData: state => state.fetch_leave_credits.data,
  fetchLeaveCreditsError: state => state.fetch_leave_credits.errors,
  // fetch_leave_slots
  fetchLeaveSlotsState: state => state.fetch_leave_slots.state,
  fetchLeaveSlotsData: state => state.fetch_leave_slots.data,
  fetchLeaveSlotsError: state => state.fetch_leave_slots.errors,
  // create_schedule_bulk
  createScheduleBulkState: state => state.create_schedule_bulk.state,
  createScheduleBulkData: state => state.create_schedule_bulk.data,
  createScheduleBulkError: state => state.create_schedule_bulk.errors,
  // employee
  fetchEmployeesData: state => state.employee.employeesData,
  fetchEmployeesTotal: state => state.employee.employeesTotal,
  fetchEmployeesError: state => state.employee.employeeErrors,
  fetchEmployeesState: state => state.employee.employeeFetchState,
  // create_leave_slot_bulk
  createLeaveSlotBulkState: state => state.create_leave_slot_bulk.state,
  createLeaveSlotBulkData: state => state.create_leave_slot_bulk.data,
  createLeaveSlotBulkError: state => state.create_leave_slot_bulk.errors,
  // update_schedule
  updateScheduleState: state => state.update_schedule.state,
  updateScheduleData: state => state.update_schedule.data,
  updateScheduleError: state => state.update_schedule.errors,
  // cancel_leave
  cancelLeaveState: state => state.cancel_leave.state,
  cancelLeaveData: state => state.cancel_leave.data,
  cancelLeaveError: state => state.cancel_leave.errors,
  // create_schedule
  createScheduleState: state => state.create_schedule.state,
  createScheduleData: state => state.create_schedule.data,
  createScheduleError: state => state.create_schedule.errors,
  // excel_to_array_schedules
  excelToArrayScheduleState: state => state.excel_to_array_schedules.state,
  excelToArrayScheduleData: state => state.excel_to_array_schedules.data,
  excelToArrayScheduleError: state => state.excel_to_array_schedules.errors,
};
export default getters;
