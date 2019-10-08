const version = "v1";
/**
 * API routes mapping consuming the provided backend API.
 */
const api = {
  $children: {
    // region Auth
    auth: {
      $prefix: "auth",

      login: {
        $url: "login",
        $method: "POST"
      },
      logout: {
        $url: "logout",
        $method: "GET"
      },
      user: {
        $url: "user",
        $method: "GET"
      }
      // endregion Auth
    },
    api: {
      // region API paths
      $prefix: `api/${version}`,
      $children: {
        // region attendance
        attendance: {
          $prefix: "attendance",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          create: {
            // $url: "create",
            // $method: "POST"
            $prefix: "create",
            single: {
              $url: "",
              $method: "POST"
            },
            $children: {
              // region bulk creation
              bulk: {
                $prefix: "bulk",
                data: {
                  $url: "",
                  $method: "POST"
                },
                excel: {
                  $url: "excel",
                  $method: "POST"
                }
              }
              // end region bulk creation
            }
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          },
          delete: {
            $url: "delete",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `delete/${id}`)
          },
          search: {
            $url: "search",
            $method: "GET"
          },
          agent_timein: {
            $url: "time_in",
            $method: "POST"
          },
          agent_timeout: {
            $url: "time_out",
            $method: "POST"
          },
          fetch: {
            $url: "fetch",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          }
        },
        // endregion attendance

        // region schedules
        schedules: {
          $prefix: "schedules",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          agents: {
            $url: "agents",
            $method: "GET"
          },
          fetch: {
            $url: "agents",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          },
          create: {
            // $url: "create",
            // $method: "POST"
            $prefix: "create",
            single: {
              $url: "",
              $method: "POST"
            },
            $children: {
              // region bulk creation
              bulk: {
                $prefix: "bulk",
                data: {
                  $url: "",
                  $method: "POST"
                },
                excel: {
                  $url: "excel",
                  $method: "POST"
                }
              }
              // end region bulk creation
            }
          },
          create_bulk: {
            $url: "create/bulk",
            $method: "POST",
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          },
          delete: {
            $url: "delete",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `delete/${id}`)
          },
          search: {
            $url: "search",
            $method: "GET"
          },
          stats: {
            $url: "stats",
            $method: "GET"
          },
          fetchSchedule: {
            $url: "fetch",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          },
          excel_to_array:{
            $url: "excel_to_array",
            $method: "POST",
          },
          report: {
            $url: "work/report",
            $method: "GET"
          },
          today: {
            $url: "work/today",
            $method: "GET"
          },
          join_ot: {
            $url: "overtime/join",
            $method: "POST"
          },
          approve_ot:{
            $url: "overtime/approve",
            $method: "POST"
          },
          revert_ot:{
            $url: "overtime/approve/revert",
            $method: "POST"
          }
        },
        // endregion schedules

        // region request schedules
        request_schedules: {
          $prefix: "request_schedules",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          create: {
            $url: "create",
            $method: "POST"
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          },
          delete: {
            $url: "delete",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `delete/${id}`)
          },
          search: {
            $url: "search",
            $method: "GET"
          },
          fetch: {
            $url: "fetch",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          },
          applicant: {
            $url: "applicant",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          },
          requested_by: {
            $url: "requested_by",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          },
          managed_by: {
            $url: "managed_by",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          }
        },
        // endregion request schedules

        // region access levels
        access_levels: {
          $prefix: "access_levels",
          create: {
            $url: "create",
            $method: "POST"
          }
        },
        // endregion access levels

        // region overtime
        overtime: {
          $prefix: "overtime",
          fetchAll: {
            $url: "",
            $method: "GET"
          },
          search: {
            $url: "search",
            $method: "GET"
          },
          create: {
            $url: "create",
            $method: "POST"
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          },
          delete: {
            $url: "delete",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `delete/${id}`)
          }
        },
        // endregion overtime

        // region access levels
        logs: {
          $prefix: "logs",
          create: {
            $url: "create",
            $method: "POST"
          },
          search: {
            $url: "search",
            $method: "GET"
          },
          fetchAll: {
            $url: "",
            $method: "GET"
          },
          fetch: {
            $url: "",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          }
        },
        // endregion access levels

        // region access levels
        clusters: {
          $prefix: "clusters",
          create: {
            $url: "create",
            $method: "POST"
          }
        },
        // endregion access levels

        // region reports
        reports: {
          $prefix: "reports",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          IR: {
            $url: "IR",
            $method: "GET"
          },
          issuedTo: {
            $url: "issued_to",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `issued_to/${id}`)
          },
          issuedBy: {
            $url: "issued_by",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `issued_by/${id}`)
          },
          allUsers: {
            $url: "all_users",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `all_users/${id}`)
          },
          allReports: {
            $url: "IR",
            $method: "GET"
          },
          create: {
            $url: "create",
            $method: "POST"
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          },
          issued_to_search: {
            $url: "issuedto/search",
            $method: "GET"
          },
          issued_byf_search: {
            $url: "issuedby/search",
            $method: "GET"
          },
          create_response: {
            $url: "user_response",
            $method: "POST"
          },
          update_response: {
            $url: "update_response",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update_response/${id}`)
          }
        },
        // endregion reports

        // region users
        users: {
          $prefix: "users",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          statusList: {
            $url: "status_list",
            $method: "GET"
          },
          create: {
            $url: "create",
            $method: "POST"
          },
          bulk_change_status: {
            $url: "bulk_change_status",
            $method: "POST"
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          },
          change_pass: {
            $url: "change_pass",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `change_pass/${id}`)
          },
          reset_pass: {
            $url: "reset_pass",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `reset_pass/${id}`)
          },
          delete: {
            $url: "delete",
            $method: "POST",
            $requires: ["user_id"],
            $format: Template(() => `delete/${user_id}`)
          }
        },
        // endregion users

        // startregion user status
        user_status: {
          $prefix: "users",
          create: {
            $url: "add_user_status",
            $method: "POST"
          },
          update: {
            $url: "update_user_status",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update_user_status/${id}`)
          },
          delete: {
            $url: "delete_user_status",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `delete_user_status/${id}`)
          }
        },
        // endregion user status

        // startregion user status
        vto: {
          $prefix: "schedules/vto",
          list:{
            $url: "list",
            $method: "GET"
          },
          search:{
            $url: "search",
            $method: "GET"
          },
          create: {
            $url: "create",
            $method: "POST"
          },
          cancel: {
            $url: "create/revert",
            $method: "POST"
          },
          update: {
            $url: "update_user_status",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update_user_status/${id}`)
          },
          delete: {
            $url: "delete_user_status",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `delete_user_status/${id}`)
          }
        },
        // endregion user status

        // region sanction levels
        sanction_levels: {
          $prefix: "sanction_level",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          search: {
            $url: "search",
            $method: "GET"
          },
          create: {
            $url: "create",
            $method: "POST"
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          }
        },
        // endregion sanction levels

        // region sanction types
        sanction_types: {
          $prefix: "sanction_type",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          fetch_sanction_types: {
            $url: "sanction_types",
            $method: "GET"
          },
          search: {
            $url: "search",
            $method: "GET"
          },
          create: {
            $url: "create",
            $method: "POST"
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          }
        },
        // endregion sanction types

        // region leave
        leaves: {
          $prefix: "leaves",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          fetch: {
            $url: "fetch",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          },
          create: {
            $url: "create",
            $method: "POST"
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          },
          delete: {
            $url: "delete",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `delete/${id}`)
          },
          approve: {
            $url: "approve",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `approve/${id}`)
          },
          reject: {
            $url: "reject",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `reject/${id}`)
          },
          cancel: {
            $url: "cancel",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `cancel/${id}`)
          }
        },
        // endregion leave

        // region leave credits
        leave_credits: {
          $prefix: "leaves/credits",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          fetch: {
            $url: "fetch",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          },
          create: {
            $url: "create",
            $method: "POST"
          },
          bulk_create: {
            $url: "create/agents",
            $method: "POST"
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          },
          delete: {
            $url: "delete",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `delete/${id}`)
          },
          search: {
            $url: "search",
            $method: "GET"
          }
        },
        // endregion leave credits

        // region leave slots
        leave_slots: {
          $prefix: "leaves/slots",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          fetch: {
            $url: "fetch",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          },
          create: {
            $url: "create",
            $method: "POST"
          },
          create_bulk: {
            $url: "create/bulk",
            $method: "POST"
          },
          update: {
            $url: "update",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `update/${id}`)
          },
          delete: {
            $url: "delete",
            $method: "POST",
            $requires: ["id"],
            $format: Template(() => `delete/${id}`)
          },
          search: {
            $url: "search",
            $method: "GET"
          }
        },
        // endregion leave slots

        // region agents
        agents: {
          $prefix: "agents",

          fetchAll: {
            $url: "",
            $method: "GET"
          },
          fetch: {
            $url: "fetch",
            $method: "GET",
            $requires: ["id"],
            $format: Template(() => `fetch/${id}`)
          }
        },
        // endregion agents

        // startregion excel
        excel: {
          $prefix: "excel",
          employeeTemplate: {
            $url: "export_add_template",
            $method: "GET"
          },
          employeeList: {
            $url: "export_report",
            $method: "GET"
          },
          reassignTemplate: {
            $url: "reassign_template",
            $method: "GET"
          },
          multisheet: {
            $url: "create_multisheet_excel",
            $method: "GET"
          },
          export_sva: {
            $url: "export_sva",
            $method: "GET"
          }
        }
      }
    }
    // endregion API paths
  }
};

/**
 *Formats the passed callback to its full url path.
 *
 * @param {function} cb
 * return function
 */
function Template(cb) {
  return function(data) {
    const dataKeys = [];
    const dataVals = [];
    for (const key in data) {
      dataKeys.push(key);
      dataVals.push(data[key]);
    }
    const func = new Function(...dataKeys, "return (" + cb + ")();");
    return func(...dataVals);
  };
}

/**
 * Export const api for api-helper consumption.
 */
export { api };
