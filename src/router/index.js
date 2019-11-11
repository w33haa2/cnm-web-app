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
             },
             {
               path: "/employee/reassign",
               component: () => import("@/views/cluster_log/admin"),
               name: "Reassign",
               meta: {
                 title: "Reassign"
               }
             }
           ]
         },
         IrRouter,
         {
           path: "leave_credits",
           component: Layout,
           redirect: "/leave_credits",
           //  alwaysShow: true, // will always show the root menu
           name: "Leave Credits",
           meta: {
             title: "Leave Credits",
             icon: "leave-credits",
             roles: ["HR Manager"]
           },
           children: [
             {
               path: "/leave_credits",
               component: () => import("@/views/leave_credits/index"),
               meta: {
                 title: "Leave Credits",
                 noCache: false
               }
             }
           ]
         },
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
           path: "/work_force",
           component: Layout,
           name: "Work Force",
           meta: {
             roles: [
               "RTA Manager",
               "RTA Supervisor",
               "RTA Analyst",
               "Admin",
               "Operations Manager",
               "Team Leader"
             ]
           },
           children: [
             {
               path: "/work_force",
               component: () => import("@/views/work_force"),
               name: "Work Force",
               meta: {
                 title: "Work Force",
                 icon: "work-force",
                 noCache: false
               }
             }
           ]
         },
         {
           path: "/cluster_log",
           component: Layout,
           name: "Cluster Log",
           meta: {
             roles: ["RTA Manager", "RTA Supervisor", "RTA Analyst"]
           },
           children: [
             {
               path: "/cluster_log",
               component: () => import("@/views/cluster_log"),
               name: "Cluster Log",
               meta: {
                 title: "Cluster Log",
                 icon: "table",
                 noCache: false
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
             roles: [
               "Representative - Order Placer",
               "IT Specialist",
               "IT Support",
               "RTA Analyst",
               "Product Trainer",
               ,
               "Maintenance Staff",
               "QA Assurance Analyst",
               "Payroll Assistant",
               "Accountant"
             ]
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
           path: "incident_reports",
           component: Layout,
           redirect: "/incident_reports/recieved",
           //  alwaysShow: true, // will always show the root menu
           name: "Incident Reports",
           meta: {
             title: "Incident Reports",
             icon: "documentation",
             roles: [
               "Finance Officer",
               "Team Leader",
               "Operations Manager",
               "RTA Supervisor",
               "RTA Manager",
               "QA Supervisor",
               "T & Q Manager",
               "IT Supervisor"
             ]
           },
           children: [
             {
               path: "/incident_reports/receive",
               component: () => import("@/views/incident_reports/receive"),
               name: "Receive",
               meta: {
                 title: "Receive"
               }
             },
             {
               path: "/incident_reports/issue",
               component: () => import("@/views/incident_reports/issue"),
               name: "Issue",
               meta: {
                 title: "Issue"
               }
             }
           ]
         },
         {
           path: "/agent_schedules",
           component: Layout,
           name: "Agent Schedules",
           meta: {
             roles: [
               "Operations Manager",
               "Team Leader",
               "RTA Manager",
               "RTA Supervisor",
               "RTA Analyst",
               "HR Manager",
               "HR Assistant",
               "Admin"
             ]
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
             roles: [
               "Operations Manager",
               "Team Leader",
               "RTA Manager",
               "RTA Supervisor",
               "RTA Analyst"
             ]
           },
           children: [
             {
               path: "/agent/leave",
               component: () => import("@/views/leave/index"),
               name: "Agent Leave",
               meta: {
                 title: "Agent Leave",
                 noCache: false,
                 icon: "calendar-check"

                 // if do not set roles, means: this page does not requireincident_report
               }
             }
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
                 noCache: false,
                 icon: "calendar-slots"

                 // if do not set roles, means: this page does not requireincident_report
               }
             }
           ]
         },
         {
           path: "/agent_vto",
           component: Layout,
           name: "Agent VTO",
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
                 icon: "vto"
               }
             }
           ]
         },
         {
           path: "/missed_logs",
           component: Layout,
           name: "Missed Logs",
           meta: {
             roles: ["RTA Manager", "RTA Supervisor", "RTA Analyst","Operations Manager","Team Leader","Representative - Order Placer"]
           },
           children: [
             {
               path: "/missed_logs",
               component: () => import("@/views/missed_logs"),
               name: "Missed Logs",
               meta: {
                 title: "Missed Logs",
                 icon:"missed_logs",
                 noCache: false
               }
             }
           ]
         },
        //  {
        //    path: "/missed_logs",
        //    component: Layout,
        //    name: "Agent Missed Logs",
        //    meta: {
        //      roles: ["Operations Manager", "Team Leader"]
        //    },
        //    children: [
        //      {
        //        path: "/missed_logs",
        //        component: () => import("@/views/missed_logs/rta"),
        //        name: "Agent Missed Logs",
        //        meta: {
        //          title: "Agent Missed Logs",
        //          noCache: false
        //        }
        //      }
        //    ]
        //  },
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
                 roles: ["RTA Manager", "RTA Supervisor", "RTA Analyst"]
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
                 roles: ["RTA Manager", "RTA Supervisor", "RTA Analyst"]
               }
             }
           ]
         },

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
