/**
 *  THE API GUIDE
 *
 *
 * -> name (string) -> represent the page name.
 *
 * -> url (string) -> path of the page which creates an icon button for redirect.
 *
 * -> link (string) -> a unique key which is used for navigation events (on click and on scroll).
 *
 * -> roles (array) -> array of string that contains role names. This will be the basis for the data visibility by role (If the array is empty it will be visible to all roles, else it will only be visible to the listed roles.).
 *
 * -> features (array of object) -> list of the features under the page.
 *
 *
 *
 * features object
 *
 * ---> name (string) -> represent the feature name.
 *
 * ---> description (string) -> additional information that is display beside the feature name.
 *
 * ---> link (string) -> a unique key which is used for navigation events (on click and on scroll).
 *
 * ---> roles (array) -> array of string that contains role names. This will be the basis for the data visibility by role (If the array is empty it will be visible to all roles, else it will only be visible to the listed roles.)
 *
 * ---> steps (array object) -> array that contains steps under this feature. (numbering of steps is based on the array order).
 *
 * ---> hints (array object) -> array that contains steps under this feature. (numbering of steps is based on the array order).
 *
 *
 *
 * steps object
 *
 * ------> step (string) -> step instruction.
 * ------> link (string) -> key that correspond to other links on the guide page. (for guide redirection).
 *
 *
 *
 * hints object
 *
 * ------> hint (string)
 * ------> link (string) -> key that correspond to other links on the guide page. (for guide redirection).
 */

export const guide_obj = [
    // intro
    {
        name: "Introduction",
        description: null,
        url: null,
        link: "introduction",
        roles: [],
        features: []
    },
    // employee page
    {
        name: "Employee List",
        description: null,
        url: "/employee",
        link: "employee_list",
        roles: ["HR Manager", "HR Assistant", "Admin"],
        features: [
            // add employee
            {
                name: "Add Employee",
                description: "Adding an employee using the application form.",
                link: "add_employee",
                button: {
                    style: "",
                    class: "active",
                    icon: "plus-icon",
                    tooltip: "Add Employee"
                },
                steps: [
                    { step: "Click the button to display form.", link: null },
                    { step: "Fill up all the required form fields.", link: null },
                    { step: "Click confirm to save.", link: null }
                ],
                hints: [{
                    hint: "To upload an existing image to the form, Click the avatar image on the form to trigger image upload.",
                    link: null
                }],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            },
            // change employee status
            {
                name: "Change Employee Status",
                description: null,
                link: "change_employee_status",
                button: {
                    style: "",
                    class: "primary",
                    icon: "account-edit-icon",
                    tooltip: "Change Employee Status"
                },
                steps: [{
                        step: "Click the Change Employee Status button to display form.",
                        link: null
                    },
                    { step: "Fill up all the required form fields.", link: null },
                    { step: "Click confirm to save.", link: null }
                ],
                hints: [{
                    hint: "You can change the status of multiple employees at once with the same date and status."
                }],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            },
            // import employee status
            {
                name: "Import Employee",
                description: null,
                link: "import_employee",
                button: {
                    style: "",
                    class: "excel",
                    icon: "file-import-icon",
                    tooltip: "Import Employee"
                },
                steps: [{
                        step: "Click the Import Employee Button to enable file upload window.",
                        link: null
                    },
                    { step: "Select the file you want to upload.", link: null },
                    { step: "Click open to start import.", link: null }
                ],
                hints: [{
                        hint: "See how to download the template file",
                        link: "export_template"
                    },
                    {
                        hint: "Inside the template, value for Supervisor column must be the head's email address.",
                        link: null
                    },
                    {
                        hint: "Inside the template, value for Position column can be found under position page",
                        link: "position-list"
                    },
                    {
                        hint: "Inside the template, value for Status column can be found under status page",
                        link: "status-list"
                    },
                    {
                        hint: "If you accidentally uploaded the wrong file, just refresh the page and try again",
                        link: null
                    },
                    {
                        hint: "You can also update multiple employee info using this feature. Please make sure that the email of the employee you want to update is correct and all the required fields are filled on the template.",
                        link: null
                    }
                ],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            },
            // export employee
            {
                name: "Export Employee",
                description: "Download an xlsx file that contains data of all employees.",
                link: "export_employee",
                button: {
                    style: "",
                    class: "excel",
                    icon: "file-export-icon",
                    tooltip: "Export Employee"
                },
                steps: [{
                    step: "Click the Export Employee button to download the file.",
                    link: null
                }],
                hints: [{
                    hint: "Download time may vary on the data being exported.",
                    link: null
                }],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            },
            // export template
            {
                name: "Export Template",
                description: null,
                link: "export_template",
                button: {
                    style: "",
                    class: "excel",
                    icon: "export-icon",
                    tooltip: "Export Template"
                },
                steps: [{
                    step: "Click the Export Template button to download the file.",
                    link: null
                }],
                hints: [{
                    hint: "Download time may vary on the data being exported.",
                    link: null
                }],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            },
            // export template
            {
                name: "Edit Employee",
                description: null,
                link: "edit-employee",
                button: {
                    style: "",
                    class: "",
                    icon: "square-edit-icon",
                    tooltip: "Edit"
                },
                steps: [{
                        step: "Click the Edit button on the employee list table to display form.",
                        link: null
                    },
                    { step: "Fill up fields you want to edit.", link: null },
                    { step: "Click confrim to save.", link: null }
                ],
                hints: [{
                        hint: "Updating an employee's status and head in this process will only affect the employee's initial details.",
                        link: null
                    },
                    {
                        hint: "If you want to change or update employee status without overiding the previous data, please see how to Change Employee Status",
                        link: "change_employee_status"
                    },
                    {
                        hint: "If you want to reassign an employee to another head without overiding the previous data, please see how to reassign employee",
                        link: "reassign_employee"
                    }
                ],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            }
        ]
    },
    // position page
    {
        name: "Position List",
        description: "Displays the list of positions available in the web app. You can use values of the table column 'Description' for filling the excel template.",
        url: "/employee/position",
        link: "position-list",
        roles: ["Admin", "HR Manager", "HR Assistant"],
        features: []
    },
    //  status page
    {
        name: "Status List",
        description: "Displays the list of Status available in the web app. You can use values of the table column 'Type' for filling the excel template.",
        url: "/employee/status",
        link: "status-list",
        roles: ["Admin", "HR Manager", "HR Assistant"],
        features: []
    },
    //  assignment page
    {
        name: "Assignment List",
        description: "Displays the list of user assignments for viewing employee assignment logs.",
        url: "/employee/status",
        link: "assignment-list",
        roles: ["Admin", "HR Manager", "HR Assistant"],
        features: [
            // reassign employee
            {
                name: "Reassign Employee",
                description: "Reassigning employee through this process logs employee's previous assignments.",
                link: "reassign-employee",
                button: {
                    style: "",
                    class: "active",
                    icon: "plus-icon",
                    tooltip: "Add Employee"
                },
                steps: [
                    { step: "Click the button to display form.", link: null },
                    { step: "Fill up all the required form fields.", link: null },
                    { step: "Click confirm to save.", link: null }
                ],
                hints: [{
                        hint: "You can put multiple values under subordinates field for batch input.",
                        link: null
                    },
                    {
                        hint: "Adding employee though the app and excel will automatically update assigments.",
                        link: null
                    },
                    {
                        hint: "Any alteration for this page must be official and correct as it affects employee's history.",
                        link: null
                    }
                ],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            }
        ]
    },
    // Agent Leaves
    // agent
    {
        name: "Agent Leave",
        description: null,
        url: "/leaves",
        link: "leaves",
        roles: ["Representative - Order Placer"],
        features: [{
            name: "Add Leave",
            description: null,
            link: "agent-leaves-rop",
            button: {
                style: "",
                class: "active",
                icon: "plus-icon",
                tooltip: "Add Leave",
            },
            steps: [
                { step: "Click the button to display form.", link: null },
                { step: "Fill up all the required form fields.", link: null },
                { step: "Click confirm to save.", link: null }
            ],
            links: [],
            roles: []
        }]
    },
    {
        name: "Work Report",
        description: "A page where employee can view his/her work history.",
        url: "/work_reports",
        link: "work-reports",
        roles: ["Representative - Order Placer"],
        features: []
    },



    // Incident Reports
    {
        name: "Issue (Incident Report)",
        description: null,
        url: "/incident_reports/issue",
        link: "incident_report_issue",
        roles: [
            "HR Manager",
            "Admin",
            "Operations Manager",
            "Team Leader",
            "RTA Manager",
            "RTA Supervisor"
        ],
        features: [{
                name: "Report an Incident",
                description: null,
                link: "report-an-incident",
                button: {
                    style: "",
                    class: "active",
                    icon: "plus-icon",
                    tooltip: "Report an Incident"
                },
                steps: [{
                        step: "Click the Report an Incident button to display the form.",
                        link: null
                    },
                    { step: "Fill up all the required form fields.", link: null },
                    { step: "Click confirm to save.", link: null }
                ],
                hints: [],
                roles: []
            },
            {
                name: "View Report",
                description: null,
                link: "view-incident-report-issue",
                button: {
                    style: "",
                    class: "",
                    icon: "comment-eye-icon",
                    tooltip: "View Report"
                },
                steps: [
                    { step: "Click the View Report button on the table.", link: null }
                ],
                hints: [
                    { hint: "You can perform update report function on this view." }
                ],
                roles: []
            },
            {
                name: "Update Report",
                description: null,
                link: "update-incident-report-issue",
                button: {
                    style: "",
                    class: "",
                    icon: "",
                    tooltip: null
                },
                steps: [
                    { step: "Click the View Report button on the table.", link: null },
                    { step: "Fill up your updates.", link: null },
                    { step: "Click confirm to save.", link: null }
                ],
                hints: [{
                    hint: "Issued Incident Reports can only be updated when there are no response yet or if its still on OPEN status.",
                    link: null
                }],
                roles: []
            }
        ]
    },
    {
        name: "Received (Incident Report)",
        description: null,
        url: "/incident_reports/receive",
        link: "receive-incident-report",
        roles: [],
        features: [{
                name: "View Report",
                description: null,
                link: "receive-incident-report-view",
                button: {
                    style: "",
                    class: "",
                    icon: "comment-eye-icon",
                    tooltip: "View Report"
                },
                steps: [
                    { step: "Click the View Report button on the table.", link: null }
                ],
                hints: [],
                roles: []
            },
            {
                name: "Report Response",
                description: null,
                link: "receive-incident-report-respond",
                button: {
                    style: "",
                    class: "",
                    icon: null,
                    tooltip: null
                },
                steps: [
                    { step: "Click the View Report button on the table.", link: null },
                    {
                        step: "Input your response on the dedicated text-area.",
                        link: null
                    },
                    { step: "Click confirm to save.", link: null }
                ],
                hints: [{
                    hint: "User is only allowed to edit his/her response when the report status is OPEN.",
                    link: ""
                }],
                roles: []
            }
        ]
    },
    {
        name: "All (Incident Reports)",
        description: "The display of all incident reports where you can update the status of a report. OPEN status means the report is currently active and CLOSE for the resolved report.",
        link: "incident-reports",
        url: "/incident_reports/all",
        roles: ["Admin", "HR Manager", "HR Assistant"],
        features: [{
                name: "View Report",
                description: null,
                link: "all-incident-report-view",
                button: {
                    style: "",
                    class: "",
                    icon: "comment-eye-icon",
                    tooltip: "View Report"
                },
                steps: [
                    { step: "Click the View Report button on the table.", link: null }
                ],
                hints: [],
                roles: []
            },
            {
                name: "Update Report Status",
                description: null,
                link: "all-incident-report-view",
                button: {
                    style: "",
                    class: "",
                    icon: null,
                    tooltip: null
                },
                steps: [{
                    step: "Click Status cell on the table to toggle status.",
                    link: null
                }],
                hints: [],
                roles: []
            }
        ]
    },
    // sanction types and levels page
    {
        name: "Sanction Type",
        description: null,
        url: "/incident_reports/sanction/type",
        link: "incident-reports-sanction-type",
        roles: ["Admin", "HR Manager", "HR Assistant"],
        features: [
            // reassign employee
            {
                name: "Add Sanction Type",
                description: null,
                link: "add-sanction-type",
                button: {
                    style: "",
                    class: "active",
                    icon: "plus-icon",
                    tooltip: "Add Sanction Type"
                },
                steps: [
                    { step: "Click the button to display form.", link: null },
                    { step: "Fill up all the required form fields.", link: null },
                    { step: "Click confirm to save.", link: null }
                ],
                hints: [{
                    hint: "This table must be filled first before you can use it for creating incident reports.",
                    link: null
                }],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            }
        ]
    },
    {
        name: "Sanction Level",
        description: null,
        url: "/incident_reports/sanction/level",
        link: "incident-reports-sanction-level",
        roles: ["Admin", "HR Manager", "HR Assistant"],
        features: [
            // reassign employee
            {
                name: "Add Sanction Level",
                description: null,
                link: "add-sanction-level",
                button: {
                    style: "",
                    class: "active",
                    icon: "plus-icon",
                    tooltip: "Add Sanction Level"
                },
                steps: [
                    { step: "Click the button to display form.", link: null },
                    { step: "Fill up all the required form fields.", link: null },
                    { step: "Click confirm to save.", link: null }
                ],
                hints: [{
                    hint: "This table must be filled first before you can use it for creating incident reports.",
                    link: null
                }],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            }
        ]
    },
    // leave credits
    {
        name: "Leave Credits",
        description: null,
        url: "/leave_credits",
        link: "leave-credits",
        roles: ["Admin", "HR Manager", "HR Assistant"],
        features: [
            // add leave credit
            {
                name: "Add Leave Credits",
                description: null,
                link: "add-leave-credits",
                button: {
                    style: "",
                    class: "active",
                    icon: "plus-icon",
                    tooltip: "Add Leave Credits"
                },
                steps: [
                    { step: "Click the button to display form.", link: null },
                    { step: "Fill up all the required form fields.", link: null },
                    { step: "Click confirm to save.", link: null }
                ],
                hints: [{
                        hint: "Adding of leave credits will be applied to all new employee.",
                        link: null
                    },
                    {
                        hint: "Must be filled first before approving employee leaves.",
                        link: null
                    },
                ],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            }
        ]
    },
    // leave
    {
        name: "Agent Scheules",
        description: null,
        url: "/agent_schedules",
        link: "agent-schedules",
        roles: ["Admin", "HR Manager", "HR Assistant"],
        features: [
            // add leave credit
            {
                name: "Add Leave",
                description: null,
                link: "add-leave",
                button: {
                    style: "",
                    class: "active",
                    icon: "plus-icon",
                    tooltip: "Add Leave"
                },
                steps: [
                    { step: "Click the button to display form.", link: null },
                    { step: "Fill up all the required form fields.", link: null },
                    { step: "Click confirm to save.", link: null }
                ],
                hints: [],
                roles: ["HR Manager", "HR Assistant", "Admin"]
            },
            {
                name: "Send SVA to email",
                description: null,
                link: "send-sva-to-email",
                button: {
                    style: "",
                    class: "excel",
                    icon: "email-send-icon",
                    tooltip: "Send SVA to email"
                },
                steps: [
                    { step: "Click the button to display form.", link: null },
                    { step: "Fill up all the required form fields.", link: null },
                    { step: "Click download and check your mail.", link: null }
                ],
                hints: [],
                roles: ["HR Manager", "HR Assistant", "Admin"]

            }
        ]
    },
    // Agent
    // {
    //     name: 
    // }
];