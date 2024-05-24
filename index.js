const inquirer = require('inquirer');
const sequelize = require('./config/connection');

function employeeManager() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "menuOption",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit"]
    }).then((response) => {
        if(response.menuOption === "View All Departments") {
            sequelize.query(`SELECT * FROM department`, (err, result) => {
                console.log(`Viewing All Departments`);
                console.table(result);
                employeeManager();
            })

            // TODO: Connect database to show a formatted table showing department names and ids
        }
        else if(response.menuOption === "View All Roles") {
            console.log(`View All Roles`);
            // TODO: Connect database to show the job title, role id, the department that role belongs to, and the salary for that role
        }
        else if(response.menuOption === "View All Employees") {
            console.log(`View All Employees`);
            // TODO: Connect database to show a formatted table showing employee data, 
            // including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
        }
        else if(response.menuOption === "Add a Department") {
            inquirer.prompt({
                type: "input",
                message: "Please enter the name of the department to add:",
                name: "newDepartment"
            }).then((response) => {
                // TODO: Connect the database to seed the new department into the database.
                console.log(`The department ${response.newDepartment} has been successfully added!`);
            });
        }
        else if(response.menuOption === "Add a Role") {
            inquirer.prompt([
            {
                type: "input",
                message: "Please enter the name of the new role to add:",
                name: "roleName"
            },
            {
                type: "input",
                message: "Please enter the salary amount for the role:",
                name: "roleSal"
            },
            {
                type: "list",
                message: "Please select the department that the role will belong to:",
                name: "roleDep",
                choices: ["CONNECT DATABASE FOR CHOICES", "CONNECT DATABASE FOR CHOICES"]
            }
            ]).then((response) => {
                // TODO: Connect the database to seed the new role into the database.
                console.log(`The role ${response.roleName} with the salary amount of ${response.roleSal} in the ${response.roleDep} has been successfully added!`);
            })
        }
        else if(response.menuOption === "Add an Employee") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter the employee's first name:",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "Please enter the employee's last name:",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "Please select the role that this employee will belong to:",
                    name: "empRole",
                    choices: ["CONNECT DATABASE FOR CHOICES", "CONNECT DATABASE FOR CHOICES"]
                },
                {
                    type: "list",
                    message: "Please select the manager that this employee will belong to:",
                    name: "empManage",
                    choices: ["None", "CONNECT DATABASE FOR CHOICES"]
                }
                ]).then((response) => {
                    // TODO: Connect the database to seed the new role into the database.
                    console.log(`The employee ${response.firstName} ${response.lastName} with the role of ${response.empRole} has been successfully added! Current Manager: ${response.empManage}`);
                })
        }
        else if(response.menuOption === "Update an Employee Role") {
            console.log(`Update an Employee Role`);
            // TODO: Connect database to allow option to select an employee, update their new role and for this information to be updated in the database 
        }
        else {
            console.log(`Thank you for using the Employee Manager!`)
        }
    })
}

function init() {
    console.log(`
    ***************************************************
    *                                                 *
    *  _____                 _                        *
    * | ____|_ __ ___  _ __ | | ___  _   _  ___  ___  *
    * |  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\ *
    * | |___| | | | | | |_) | | (_) | |_| |  __/  __/ *
    * |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___| *
    * |  \\/  | __ _ _ |_|  __ _  __ _|___/ _ __       *
    * | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|      *
    * | |  | | (_| | | | | (_| | (_| |  __/ |         *
    * |_|  |_|\\__,_|_| |_|\\__,_|\__,  |\\___|_|         *
    *                           |___/                 *
    *                                                 *
    ***************************************************
    `);
    employeeManager();
};

init();
