const inquirer = require('inquirer');
const { Pool } = require('pg');
const colors = require('colors');
require('dotenv').config();

const pool = new Pool(
    {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: 'localhost',
        database: process.env.DB_NAME
    },
      console.log('Connected to the business database!')
);

function employeeManager() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "menuOption",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit"]
    }).then((response) => {
        if(response.menuOption === "View All Departments") {
            pool.connect;
            pool.query('SELECT * FROM department', (err, result) => {
                if (err) throw err;
                console.table(result.rows)
                employeeManager();
            });
        }
        else if(response.menuOption === "View All Roles") {
            pool.connect;
            pool.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id`, (err, result) => {
                if (err) throw err;
                console.table(result.rows);
                employeeManager();
            });
        }
        else if(response.menuOption === "View All Employees") {
            pool.connect;
            pool.query(`SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary as salary, CASE WHEN CONCAT(manager.first_name, ' ', manager.last_name) = ' ' THEN null ELSE CONCAT(manager.first_name, ' ', manager.last_name) END as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id`, (err, result) => {
                if (err) throw err;
                console.table(result.rows);
                employeeManager();
            });
        }
        else if(response.menuOption === "Add a Department") {
            inquirer.prompt({
                type: "input",
                message: "Please enter the name of the department to add:",
                name: "newDepartment"
            }).then((response) => {
                pool.connect();
                pool.query('INSERT INTO department (name) VALUES ($1)',[response.newDepartment], (err, result) => {
                    if (err) throw err;
                    console.log(`The department ${response.newDepartment} has been successfully added!`);
                    employeeManager();
                })
            });
        }
        else if(response.menuOption === "Add a Role") {
            pool.connect();
            let department = [];
            let departmentSelectedId = [];
            let departmentId = 0;
            pool.query('SELECT * FROM department', (err, result) => {
                if (err) throw err;
                result.rows.forEach(row => {
                    department.push(row.name);
                    departmentSelectedId.push(row.id);
                });
            });
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
                choices: department
            }
            ]).then((response) => {
                for (let i = 0; i < department.length + 1; i++) {
                    if(response.roleDep === department[i]) {
                        departmentId = i + 1;
                    }}
                    pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',[response.roleName, response.roleSal, departmentId], (err, result) => {
                        if (err) throw err;
                        console.log(`The role ${response.roleName} with the salary amount of ${response.roleSal} in the ${response.roleDep} has been successfully added!`);
                        employeeManager();
                    });
                }
            )
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
            console.log(` <<< `.white + `Thank you for using the Employee Manager!`.green.bold + ` >>>`.white)
            pool.end();
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
    `.red.bold);
    employeeManager();
};

init();
