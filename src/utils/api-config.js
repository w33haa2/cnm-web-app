const version = 'v1'
/**
 * API routes mapping consuming the provided backend API.
 */
const api = {
  $children: {
    // region Auth
    auth: {
      $prefix: 'auth',

      login: {
        $url: 'login',
        $method: 'POST'
      },
      logout: {
        $url: 'logout',
        $method: 'GET'
      },
      user: {
        $url: 'user',
        $method: 'GET'
      }
      // endregion Auth
    },
    api: {
      // region API paths
      $prefix: `api/${version}`,
      $children: {
        // region attendance
        attendance: {
          $prefix: 'attendance',

          fetchAll: {
            $url: '',
            $method: 'GET'
          },
          create: {
            // $url: "create",
            // $method: "POST"
            $prefix: 'create',
            single: {
              $url: '',
              $method: 'POST'
            },
            $children: {
              // region bulk creation
              bulk: {
                $prefix: 'bulk',
                data: {
                  $url: '',
                  $method: 'POST'
                },
                excel: {
                  $url: 'excel',
                  $method: 'POST'
                }
              }
              // end region bulk creation
            }
          },
          update: {
            $url: 'update',
            $method: 'POST',
            $requires: ['id'],
            $format: Template(() => `update/${id}`)
          },
          delete: {
            $url: 'delete',
            $method: 'POST',
            $requires: ['id'],
            $format: Template(() => `delete/${id}`)
          },
          search: {
            $url: 'search',
            $method: 'GET'
          },
          fetch: {
            $url: 'fetch',
            $method: 'GET',
            $requires: ['id'],
            $format: Template(() => `fetch/${id}`)
          }
        },
        // endregion attendance

        // region schedules
        schedules: {
          $prefix: 'schedules',

          fetchAll: {
            $url: '',
            $method: 'GET'
          },
          agents: {
            $url: 'agents',
            $method: 'GET'
          },
          fetch: {
            $url: 'agents',
            $method: 'GET',
            $requires: ['id'],
            $format: Template(() => `fetch/${id}`)
          },
          create: {
            // $url: "create",
            // $method: "POST"
            $prefix: 'create',
            single: {
              $url: '',
              $method: 'POST'
            },
            $children: {
              // region bulk creation
              bulk: {
                $prefix: 'bulk',
                data: {
                  $url: '',
                  $method: 'POST'
                },
                excel: {
                  $url: 'excel',
                  $method: 'POST'
                }
              }
              // end region bulk creation
            }
          },
          update: {
            $url: 'update',
            $method: 'POST',
            $requires: ['id'],
            $format: Template(() => `update/${id}`)
          },
          delete: {
            $url: 'delete',
            $method: 'POST',
            $requires: ['id'],
            $format: Template(() => `delete/${id}`)
          },
          search: {
            $url: 'search',
            $method: 'GET'
          },
          stats: {
            $url: 'stats',
            $method: 'GET'
          },
          fetchSchedule: {
            $url: 'fetch',
            $method: 'GET',
            $requires: ['id'],
            $format: Template(() => `fetch/${id}`)
          },
          work: {
            $url: 'work',
            $method: 'GET',
            $requires: ['option'],
            $format: Template(() => `fetch/${option}`)
          }
        },
        // endregion schedules

        // region request schedules
        request_schedules: {
          $prefix: 'request_schedules',

          fetchAll: {
            $url: '',
            $method: 'GET'
          },
          create: {
            $url: 'create',
            $method: 'POST'
          },
          update: {
            $url: 'update',
            $method: 'POST',
            $requires: ['id'],
            $format: Template(() => `update/${id}`)
          },
          delete: {
            $url: 'delete',
            $method: 'POST',
            $requires: ['id'],
            $format: Template(() => `delete/${id}`)
          },
          search: {
            $url: 'search',
            $method: 'GET'
          },
          fetch: {
            $url: 'fetch',
            $method: 'GET',
            $requires: ['id'],
            $format: Template(() => `fetch/${id}`)
          },
          applicant: {
            $url: 'applicant',
            $method: 'GET',
            $requires: ['id'],
            $format: Template(() => `fetch/${id}`)
          },
          requested_by: {
            $url: 'requested_by',
            $method: 'GET',
            $requires: ['id'],
            $format: Template(() => `fetch/${id}`)
          },
          managed_by: {
            $url: 'managed_by',
            $method: 'GET',
            $requires: ['id'],
            $format: Template(() => `fetch/${id}`)
          }
        },
        // endregion request schedules

        // region access levels
        access_levels: {
          $prefix: 'access_levels',
          create: {
            $url: 'create',
            $method: 'POST'
          }
        },
        // endregion access levels

        // region access levels
        clusters: {
          $prefix: 'clusters',
          create: {
            $url: 'create',
            $method: 'POST'
          }
        },
        // endregion access levels
        // region reports
        reports: {
          $prefix: 'reports',

          fetchAll: {
            $url: '',
            $method: 'GET'
          },
          issuedTo: {
            $url: 'issued_to',
            $method: 'GET',
            $requires: ['id'],
            $format: Template(() => `issued_to/${id}`)
          },
          issuedBy: {
            $url: 'issued_by',
            $method: 'GET',
            $requires: ['id'],
            $format: Template(() => `issued_by/${id}`)
          },
          allUsers: {
            $url: 'all_users',
            $method: 'GET',
            $requires: ['id'],
            $format: Template(() => `all_users/${id}`)
          },
          allReports: {
            $url: 'IR',
            $method: 'GET',
          },
          create: {
            $url: 'create',
            $method: 'POST'
          }
          // update: {
          //   $url: 'update',
          //   $method: 'POST',
          //   $requires: ['request_schedule_id'],
          //   $format: Template(() => `update/${request_schedule_id}`)
          // },
          // delete: {
          //   $url: 'delete',
          //   $method: 'POST',
          //   $requires: ['request_schedule_id'],
          //   $format: Template(() => `delete/${request_schedule_id}`)
          // },
          // search: {
          //   $url: 'search',
          //   $method: 'GET'
          // },
          // fetch: {
          //   $url: 'fetch',
          //   $method: 'GET',
          //   $requires: ['request_schedule_id'],
          //   $format: Template(() => `fetch/${request_schedule_id}`)
          // },
          // applicant: {
          //   $url: 'applicant',
          //   $method: 'GET',
          //   $requires: ['applicant_id'],
          //   $format: Template(() => `fetch/${applicant_id}`)
          // },
          // requested_by: {
          //   $url: 'requested_by',
          //   $method: 'GET',
          //   $requires: ['requested_by_id'],
          //   $format: Template(() => `fetch/${requested_by_id}`)
          // },
          // managed_by: {
          //   $url: 'managed_by',
          //   $method: 'GET',
          //   $requires: ['managed_by_id'],
          //   $format: Template(() => `fetch/${managed_by_id}`)
          // }
        },
        // endregion reports

        // region users
        users: {
          $prefix: 'users',

          fetchAll: {
            $url: '',
            $method: 'GET'
          },
          statusList: {
            $url: 'status_list',
            $method: 'GET'
          },
          // create: {
          //   $url: 'create',
          //   $method: 'POST'
          // },
          // update: {
          //   $url: 'update',
          //   $method: 'POST',
          //   $requires: ['request_schedule_id'],
          //   $format: Template(() => `update/${request_schedule_id}`)
          // },
          delete: {
            $url: 'delete',
            $method: 'POST',
            $requires: ['user_id'],
            $format: Template(() => `delete/${user_id}`)
          }
          // search: {
          //   $url: 'search',
          //   $method: 'GET'
          // },
          // fetch: {
          //   $url: 'fetch',
          //   $method: 'GET',
          //   $requires: ['request_schedule_id'],
          //   $format: Template(() => `fetch/${request_schedule_id}`)
          // },
          // applicant: {
          //   $url: 'applicant',
          //   $method: 'GET',
          //   $requires: ['applicant_id'],
          //   $format: Template(() => `fetch/${applicant_id}`)
          // },
          // requested_by: {
          //   $url: 'requested_by',
          //   $method: 'GET',
          //   $requires: ['requested_by_id'],
          //   $format: Template(() => `fetch/${requested_by_id}`)
          // },
          // managed_by: {
          //   $url: 'managed_by',
          //   $method: 'GET',
          //   $requires: ['managed_by_id'],
          //   $format: Template(() => `fetch/${managed_by_id}`)
          // }
        },
        // endregion users

        // region sanction levels
        sanction_levels: {
          $prefix: 'sanction_level/sanction_levels',

          fetchAll: {
            $url: '',
            $method: 'GET'
          }
          // create: {
          //   $url: 'create',
          //   $method: 'POST'
          // },
          // update: {
          //   $url: 'update',
          //   $method: 'POST',
          //   $requires: ['request_schedule_id'],
          //   $format: Template(() => `update/${request_schedule_id}`)
          // },
          // delete: {
          //   $url: "delete",
          //   $method: "POST",
          //   $requires: ["user_id"],
          //   $format: Template(() => `delete/${user_id}`)
          // }
          // search: {
          //   $url: 'search',
          //   $method: 'GET'
          // },
          // fetch: {
          //   $url: 'fetch',
          //   $method: 'GET',
          //   $requires: ['request_schedule_id'],
          //   $format: Template(() => `fetch/${request_schedule_id}`)
          // },
        },
        // endregion sanction levels

        // region sanction types
        sanction_types: {
          $prefix: 'sanction_type/sanction_types',

          fetchAll: {
            $url: '',
            $method: 'GET'
          }
          // create: {
          //   $url: 'create',
          //   $method: 'POST'
          // },
          // update: {
          //   $url: 'update',
          //   $method: 'POST',
          //   $requires: ['request_schedule_id'],
          //   $format: Template(() => `update/${request_schedule_id}`)
          // },
          // delete: {
          //   $url: "delete",
          //   $method: "POST",
          //   $requires: ["user_id"],
          //   $format: Template(() => `delete/${user_id}`)
          // }
          // search: {
          //   $url: 'search',
          //   $method: 'GET'
          // },
          // fetch: {
          //   $url: 'fetch',
          //   $method: 'GET',
          //   $requires: ['request_schedule_id'],
          //   $format: Template(() => `fetch/${request_schedule_id}`)
          // },
        }
        // endregion sanction types
      }
    }
    // endregion API paths
  }
}

/**
 *Formats the passed callback to its full url path.
 *
 * @param {function} cb
 * return function
 */
function Template(cb) {
  return function(data) {
    const dataKeys = []
    const dataVals = []
    for (const key in data) {
      dataKeys.push(key)
      dataVals.push(data[key])
    }
    const func = new Function(...dataKeys, 'return (' + cb + ')();')
    return func(...dataVals)
  }
}

/**
 * Export const api for api-helper consumption.
 */
export { api }
