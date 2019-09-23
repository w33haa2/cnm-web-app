import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
import componentsRouter from "./modules/components";
import chartsRouter from "./modules/charts";
import tableRouter from "./modules/table";
import IrRouter from "./modules/Ir";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: { title: "Dashboard", icon: "dashboard", affix: true }
      }
    ]
  },
  {
    path: "/profile",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "index/:id*",
        component: () => import("@/views/profile/index")
      }
    ]
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
         {
           path: "employee",
           component: Layout,
           // redirect: "/agent",
           //  alwaysShow: true, // will always show the root menu
           name: "Employee",
           meta: {
             title: "Employee",
             icon: "user",
             roles: ["Admin", "HR Manager", "HR Assistant"]
           },
           children: [
             {
               path: "/employee",
               component: () => import("@/views/employee/index"),
               name: "List",
               meta: {
                 title: "List"
                 //  roles: ["admin"] // or you can only set roles in sub nav
               }
             },
             {
               path: "/employee/position",
               component: () => import("@/views/employee/position"),
               name: "Position",
               meta: {
                 title: "Position"
                 // if do not set roles, means: this page does not requireincident_report
               }
             },
             {
               path: "/employee/status",
               component: () => import("@/views/employee/status"),
               name: "Status",
               meta: {
                 title: "Status"
                 // if do not set roles, means: this page does not requireincident_report
               }
             }
           ]
         },
         IrRouter,
         {
           path: "/schedules",
           component: Layout,
           name: "Schedules",
           meta: {
             roles: ["Representative - Order Placer"]
           },
           children: [
             {
               path: "/schedules",
               component: () => import("@/views/schedule/index"),
               name: "Schedules",
               meta: {
                 title: "Schedules",
                 icon: "calendar"
               }
             }
           ]
         },
         {
           path: "/leaves",
           component: Layout,
           name: "Leaves",
           meta: {
             roles: ["Representative - Order Placer"]
           },
           children: [
             {
               path: "/leaves",
               component: () => import("@/views/leave/index"),
               name: "Leaves",
               meta: {
                 title: "Leaves",
                 icon: "calendar-check"
               }
             }
           ]
         },
         {
           path: "/work_report",
           component: Layout,
           name: "Work Report",
           meta: {
             roles: ["Representative - Order Placer"]
           },
           children: [
             {
               path: "/work_report",
               component: () => import("@/views/work_report/index"),
               name: "Work Report",
               meta: {
                 title: "Work Report",
                 icon: "work-report"
               }
             }
           ]
         },
         {
           path: "/incident_reports",
           component: Layout,
           name: "Incident Reports",
           meta: {
             roles: ["Representative - Order Placer"]
           },
           children: [
             {
               path: "/incident_reports",
               component: () => import("@/views/incident_reports/receive"),
               name: "Incident Reports",
               meta: {
                 title: "Incident Reports",
                 icon: "documentation"
               }
             }
           ]
         },
         {
           path: "/agent_schedules",
           component: Layout,
           name: "Agent Schedules",
           meta: {
             roles: ["Operations Manager", "Team Leader", "RTA Manager", "RTA Supervisor", "RTA Analyst"]
           },
           children: [
             {
               path: "/agent_schedules",
               component: () => import("@/views/schedule/admin"),
               name: "Agent Schedules",
               meta: {
                 title: "Agent Schedules",
                 icon: "calendar"
               }
             }
           ]
         },
         {
           path: "/agent_leaves",
           component: Layout,
           name: "Agent Leave",
           meta: {
             roles: ["Operations Manager", "Team Leader"]
           },
           children: [
            {
              path: "/agent/leave",
              component: () => import("@/views/leave/index"),
              name: "Agent Leave",
              meta: {
                title: "Agent Leave",
                noCache:false,
                icon: "calendar-check"

                // if do not set roles, means: this page does not requireincident_report
              }
            },
           ]
         },
         {
           path: "/agent_leave_slots",
           component: Layout,
           name: "Agent Leave Slots",
           meta: {
             roles: ["RTA Manager", "RTA Supervisor", "RTA Analyst"]
           },
           children: [
            {
              path: "/agent/leave_slots",
              component: () => import("@/views/leave/slots"),
              name: "Agent Leave Slots",
              meta: {
                title: "Agent Leave Slots",
                noCache:false,
                icon: "calendar-slots"

                // if do not set roles, means: this page does not requireincident_report
              }
            },
           ]
         },
         {
           path: "/agent_leave_slots",
           component: Layout,
           name: "Agent Leave Slots",
           meta: {
             roles: ["RTA Manager", "RTA Supervisor", "RTA Analyst"]
           },
           children: [
             {
               path: "/agent_vto",
               component: () => import("@/views/vto"),
               name: "Agent VTO",
               meta: {
                 title: "Agent VTO",
                 noCache: false,
                  icon: "calendar-slots"

               }
             },
           ]
         },

         {
           path: "/agent",
           component: Layout,
           // redirect: "/agent",
           //  alwaysShow: true, // will always show the root menu
           name: "Agent",
           meta: {
             title: "Agent",
             icon: "agent-headset",
             roles: ["Admin"] // you can set roles in root nav
           },
           children: [
             {
               path: "/agent/schedule",
               component: () => import("@/views/schedule/index"),
               name: "Agent Schedules",
               meta: {
                 title: "Agent Schedules",
               }
             },
            //  {
            //    path: "/agent/leave",
            //    component: () => import("@/views/leave/index"),
            //    name: "Agent Leave",
            //    meta: {
            //      title: "Agent Leave",
            //      noCache:false
            //      // if do not set roles, means: this page does not requireincident_report
            //    }
            //  },
             {
               path: "/agent/work_reports",
               component: () => import("@/views/work_report/index"),
               name: "Agent Work Reports",
               meta: {
                 title: "Agent Work Reports"
                 // if do not set roles, means: this page does not requireincident_report
               }
             },
            // //  {
            // //    path: "/agent/vto",
            // //    component: () => import("@/views/vto"),
            // //    name: "Agent VTO",
            // //    meta: {
            // //      title: "Agent VTO",
            // //      noCache: false
            // //    }
            // //  },
            //  {
            //    path: "/agent/leave_slots",
            //    component: () => import("@/views/leave/slots"),
            //    name: "Agent Leave Slots",
            //    meta: {
            //      title: "Agent Leave Slots",
            //      noCache: false
            //    }
            // }
           ]
         },
         {
           path: "action_logs",
           component: Layout,
           redirect: "/action_logs",
           //  alwaysShow: true, // will always show the root menu
           children: [
             {
               path: "/action_logs",
               component: () => import("@/views/action_logs"),
               name: "Action Logs",
               meta: {
                 title: "Action Logs",
                 icon: "form",
                 roles: ["Admin", "HR Manager"]
               }
             }
           ]
         },
         {
           path: "overtime_schedules",
           component: Layout,
           redirect: "/overtime_schedules",
           //  alwaysShow: true, // will always show the root menu
           children: [
             {
               path: "/overtime_schedules",
               component: () => import("@/views/ot_schedule"),
               name: "Overtime Schedules",
               meta: {
                 title: "Overtime Schedules",
                 icon: "overtime-clock",
                 roles: ["RTA Manager", "RTA Supervisor", "RTA Analyst","Operations Manager", "Team Leader"]
               }
             }
           ]
         },
         {
           path: "overtime_agents",
           component: Layout,
           hidden: true,
           children: [
             {
               path: "/overtime_agents/:id*",
               component: () => import("@/views/ot_agents/index"),
               meta: {
                 noCache: false,
                 roles: ["RTA Manager", "RTA Supervisor", "RTA Analyst","Operations Manager", "Team Leader"]
                 //  roles: ["Admin", "HR Manager"]
               }
             }
           ]
         },

         // {
         //   path: "/icon",
         //   component: Layout,
         //   children: [
         //     {
         //       path: "index",
         //       component: () => import("@/views/agent_schedule/index"),
         //       name: "Schedule",
         //       meta: { title: "Icons", icon: "date" }
         //     }
         //   ]
         // },

         // /** when your routing map is too long, you can split it into small modules **/
         // componentsRouter,
         // chartsRouter,
         // nestedRouter,
         // tableRouter,

         // {
         //   path: "/example",
         //   component: Layout,
         //   redirect: "/example/list",
         //   name: "Example",
         //   meta: {
         //     title: "Example",
         //     icon: "example"
         //   },
         //   children: [
         //     {
         //       path: "create",
         //       component: () => import("@/views/example/create"),
         //       name: "CreateArticle",
         //       meta: { title: "Create Article", icon: "edit" }
         //     },
         //     {
         //       path: "edit/:id(\\d+)",
         //       component: () => import("@/views/example/edit"),
         //       name: "EditArticle",
         //       meta: {
         //         title: "Edit Article",
         //         noCache: true,
         //         activeMenu: "/example/list"
         //       },
         //       hidden: true
         //     },
         //     {
         //       path: "list",
         //       component: () => import("@/views/example/list"),
         //       name: "ArticleList",
         //       meta: { title: "Article List", icon: "list" }
         //     }
         //   ]
         // },

         // {
         //   path: "/tab",
         //   component: Layout,
         //   children: [
         //     {
         //       path: "index",
         //       component: () => import("@/views/tab/index"),
         //       name: "Tab",
         //       meta: { title: "Tab", icon: "tab" }
         //     }
         //   ]
         // },

         // {
         //   path: "/error",
         //   component: Layout,
         //   redirect: "noRedirect",
         //   name: "ErrorPages",
         //   meta: {
         //     title: "Error Pages",
         //     icon: "404"
         //   },
         //   children: [
         //     {
         //       path: "401",
         //       component: () => import("@/views/error-page/401"),
         //       name: "Page401",
         //       meta: { title: "401", noCache: true }
         //     },
         //     {
         //       path: "404",
         //       component: () => import("@/views/error-page/404"),
         //       name: "Page404",
         //       meta: { title: "404", noCache: true }
         //     }
         //   ]
         // },

         // {
         //   path: "/error-log",
         //   component: Layout,
         //   children: [
         //     {
         //       path: "log",
         //       component: () => import("@/views/error-log/index"),
         //       name: "ErrorLog",
         //       meta: { title: "Error Log", icon: "bug" }
         //     }
         //   ]
         // },

         // {
         //   path: "/excel",
         //   component: Layout,
         //   redirect: "/excel/export-excel",
         //   name: "Excel",
         //   meta: {
         //     title: "Excel",
         //     icon: "excel"
         //   },
         //   children: [
         //     {
         //       path: "export-excel",
         //       component: () => import("@/views/excel/export-excel"),
         //       name: "ExportExcel",
         //       meta: { title: "Export Excel" }
         //     },
         //     {
         //       path: "export-selected-excel",
         //       component: () => import("@/views/excel/select-excel"),
         //       name: "SelectExcel",
         //       meta: { title: "Export Selected" }
         //     },
         //     {
         //       path: "export-merge-header",
         //       component: () => import("@/views/excel/merge-header"),
         //       name: "MergeHeader",
         //       meta: { title: "Merge Header" }
         //     },
         //     {
         //       path: "upload-excel",
         //       component: () => import("@/views/excel/upload-excel"),
         //       name: "UploadExcel",
         //       meta: { title: "Upload Excel" }
         //     }
         //   ]
         // },

         // {
         //   path: "/zip",
         //   component: Layout,
         //   redirect: "/zip/download",
         //   alwaysShow: true,
         //   name: "Zip",
         //   meta: { title: "Zip", icon: "zip" },
         //   children: [
         //     {
         //       path: "download",
         //       component: () => import("@/views/zip/index"),
         //       name: "ExportZip",
         //       meta: { title: "Export Zip" }
         //     }
         //   ]
         // },

         // {
         //   path: "/pdf",
         //   component: Layout,
         //   redirect: "/pdf/index",
         //   children: [
         //     {
         //       path: "index",
         //       component: () => import("@/views/pdf/index"),
         //       name: "PDF",
         //       meta: { title: "PDF", icon: "pdf" }
         //     }
         //   ]
         // },
         // {
         //   path: "/pdf/download",
         //   component: () => import("@/views/pdf/download"),
         //   hidden: true
         // },

         // {
         //   path: "/theme",
         //   component: Layout,
         //   children: [
         //     {
         //       path: "index",
         //       component: () => import("@/views/theme/index"),
         //       name: "Theme",
         //       meta: { title: "Theme", icon: "theme" }
         //     }
         //   ]
         // },

         // {
         //   path: "/clipboard",
         //   component: Layout,
         //   children: [
         //     {
         //       path: "index",
         //       component: () => import("@/views/clipboard/index"),
         //       name: "ClipboardDemo",
         //       meta: { title: "Clipboard", icon: "clipboard" }
         //     }
         //   ]
         // },

         // {
         //   path: "external-link",
         //   component: Layout,
         //   children: [
         //     {
         //       path: "https://github.com/PanJiaChen/vue-element-admin",
         //       meta: { title: "External Link", icon: "link" }
         //     }
         //   ]
         // },

         // 404 page must be placed at the end !!!
         { path: "*", redirect: "/404", hidden: true }
       ];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
