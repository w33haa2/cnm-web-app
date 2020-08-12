export const guide_obj = [
    // employee page
    {
        name: "Introduction",
        description: null,
        url: null,
        link: "introduction",
        roles: [],
        features: [],
    },
    {
        name: "Employee List",
        description: null,
        url: "/employee",
        link: "employee_list",
        roles: ["HR Manager", "HR Assistant", "Admin"], // this will only show to roles included
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
                    { step: "Click the button to display form.", link: null, },
                    { step: "Fill up all the required form fields.", link: null, },
                    { step: "Click confirm to save.", link: null, },
                ],
                hints: [{ hint: "To upload an existing image to the form, Click the avatar image on the form to trigger image upload.", link: null }],
                roles: ["HR Manager", "HR Assistant", "Admin"],
            },
            // change employee status
            {
                name: "Change Employee Status",
                description: null,
                link: "change_employee_status",
                button: {
                    style: "",
                    class: "",
                    icon: "",
                    tooltip: ""
                },
                steps: [],
                hints: [],
                roles: [],
            },
            // import employee status
            {
                name: "Import Employee",
                description: null,
                link: "import_employee",
                button: {
                    style: "",
                    class: "",
                    icon: "",
                },
                steps: [],
                hints: [],
                roles: [],
            },
            // export employee status
            {
                name: "Export Employee",
                description: null,
                link: "export_employee",
                button: {
                    style: "",
                    class: "",
                    icon: "",
                },
                steps: [],
                hints: [],
                roles: [],
            },
            // export template
            {
                name: "Export Template",
                description: null,
                link: "export_template",
                button: {
                    style: "",
                    class: "",
                    icon: "",
                },
                steps: [],
                hints: [],
                roles: [],
            },
        ]
    }
];