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
  // log in state
  loginState: state => state.user.loggingInState,
  // incident reports
  fetchingIncidentReports: state => state.incident_report.fetchingIRState,
  incidentReports: state => state.incident_report.reports,
  irErrors: state => state.incident_report.errors,
  // users
  employees: state => state.employee.employees,
  employeesData: state => state.employee.employeesData,
  employeesTotal: state => state.employee.employeesTotal,
  employeeErrors: state => state.employee.employeeErrors,
  employeeFetchState: state => state.employee.employeeFetchState,
  employeeDeleteState: state => state.employee.employeeDeleteState,
  allPosition: state => state.employee.accesslevels,
  formResponse: state => state.employee.form_request_response
}
export default getters
