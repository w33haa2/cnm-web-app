const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,

  // incident reports
  fetchingIncidentReports: state => state.incident_report.fetchingIRState,
  creatingIncidentReports: state => state.incident_report.creatingIRState,
  fetchingIssuedIncidentReports: state =>
    state.incident_report.fetchingIssuedIRState,
  fetchingReceivedIncidentReports: state =>
    state.incident_report.fetchingReceivedIRState,
  incidentReports: state => state.incident_report.reports,
  incidentReportsTotal: state => state.incident_report.reports_total,
  irErrors: state => state.incident_report.errors,

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

  // user module
  position: state => state.user.userDetails.position,
  statusList: state => state.user.data.statusList,
  statusListCount: state => state.user.count.statusList,
  potentialHead: state => state.user.data.potentialHead,
  loginState: state => state.user.loggingInState,
  fetchStateStatusList: state => state.user.fetchState.statusList,
  fetchStatePotentialHead: state => state.user.fetchState.potentialHead,

  // sanction level module
  sanctionLevels: state => state.sanction_level.sanction_levels,
  sanctionTypes: state => state.sanction_type.sanction_types,
  sanctionTypeErrors: state => state.sanction_type.sanctionTypeErrors,
  // =============== end data

  // =============== start state
  fetchSanctionLevelState: state =>
    state.sanction_level.fetchingSanctionLevelState,
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
  agentsWorkReportsfetchState: state => state.schedule_work_report.fetchingState
};
export default getters;
