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
                    tooltip: "Change Employee Status"
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