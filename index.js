const inquirer = require('inquirer');
const { Pool } = require("pg");
const colors = require('colors');
require('dotenv').config();
const {
  employeeQuery,
  managerQuery,
  roleQuery,
  employeeId,
  managerId,
  roleId,
  getDepartments,
  getRoles,
  getEmployees,
  getManagers,
  getDepartEmployees,
  getDepartBudget,
  addDepartment,
  addRole,
  addEmployee,
  updateRole,
  updateManager,
  disconnect,
} = require(`./quiries`);

function employeeManager() {
    inquirer
      .prompt({
        type: "list",
        message: "What would you like to do?",
        name: "menuOption",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "View All Managers",
          "View Employees by Department",
          "View Total Budget of a Department",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Update an Assigned Manager",
          "Delete a Department",
          "Delete a Role",
          "Delete an Employee",
          "Quit",
        ],
      })
      .then((response) => {
        if (response.menuOption === "View All Departments") {
          getDepartments()
            .then((departments) => {
              console.table(departments);
              employeeManager();
            })
            .catch((err) => {
              console.error("Error fetching departments:", err);
            });
        } else if (response.menuOption === "View All Roles") {
          getRoles()
            .then((roles) => {
              console.table(roles);
              employeeManager();
            })
            .catch((err) => {
              console.error("Error fetching roles:", err);
            });
        } else if (response.menuOption === "View All Employees") {
          getEmployees()
            .then((employees) => {
              console.table(employees);
              employeeManager();
            })
            .catch((err) => {
              console.error("Error fetching employees:", err);
            });
        } else if (response.menuOption === "View All Managers") {
          getManagers()
            .then((managers) => {
              console.table(managers);
              employeeManager();
            })
            .catch((err) => {
              console.error("Error fetching managers:", err);
            });
        } else if (response.menuOption === "View Employees by Department") {
          getDepartments()
          .then((departments) => {
            const deparmentSelection = departments.map(
              (department) => department.name
            );

            inquirer
              .prompt([
                {
                  type: "list",
                  message: "Please select the department that you wish to view the employees for:",
                  name: "selectedDepartment",
                  choices: deparmentSelection,
                },
              ]).then(async(response) => {
                const departEmp = await getDepartEmployees(response.selectedDepartment);
                console.table(departEmp);
                employeeManager();
            })
          }).catch((err) => {
            console.error("Error fetching managers:", err);
          });
        } else if (response.menuOption === "View Total Budget of a Department") {
          getDepartments()
            .then((departments) => {
              const deparmentSelection = departments.map(
                (department) => department.name
              );
        
              inquirer
                .prompt([
                  {
                    type: "list",
                    message: "Would you like to view the budget for a specific department or all departments?",
                    name: "oneOrAll",
                    choices: ["One", "All"],
                  }
                ])
                .then(async (response) => {
                  if (response.oneOrAll === "All") {
                    const allBudget = await getDepartBudget(response.oneOrAll);
                    console.table(allBudget);
                    employeeManager();
                  } else {
                    inquirer.prompt([
                      {
                        type: "list",
                        message: "Please select the department that you wish to view the budget for:",
                        name: "selectedDepartment",
                        choices: deparmentSelection,
                      },
                    ]).then(async (response) => {
                      const departBudget = await getDepartBudget(response.selectedDepartment);
                      console.table(departBudget);
                      employeeManager();
                    });
                  }
                })
                .catch((err) => {
                  console.error("Error fetching department budgets:", err);
                });
            })
            .catch((err) => {
              console.error("Error fetching departments:", err);
            }); 
        } else if (response.menuOption === "Add a Department") {
          inquirer
            .prompt({
              type: "input",
              message: "Please enter the name of the department to add:",
              name: "newDepartment",
            })
            .then((response) => {
              addDepartment(response.newDepartment)
                .then(() => {
                  console.log(
                    `The department ${response.newDepartment} has been successfully added!`
                  );
                  employeeManager();
                })
                .catch((err) => {
                  console.error("Error adding department:", err);
                });
            });
        } else if (response.menuOption === "Add a Role") {
          getDepartments()
            .then((departments) => {
              const deparmentSelection = departments.map(
                (department) => department.name
              );

              inquirer
                .prompt([
                  {
                    type: "input",
                    message: "Please enter the name of the new role to add:",
                    name: "roleName",
                  },
                  {
                    type: "input",
                    message: "Please enter the salary amount for the role:",
                    name: "roleSal",
                  },
                  {
                    type: "list",
                    message:
                      "Please select the department that the role will belong to:",
                    name: "roleDep",
                    choices: deparmentSelection,
                  },
                ])
                .then((response) => {
                  const selectedDepartment = departments.find(
                    (department) => department.name === response.roleDep
                  );
                  const departmentId = selectedDepartment.id;

                  addRole(response.roleName, response.roleSal, departmentId)
                    .then(() => {
                      console.log(
                        `The role ${response.roleName} with the salary amount of ${response.roleSal} in the ${response.roleDep} department has been successfully added!`
                      );
                      employeeManager();
                    })
                    .catch((err) => {
                      console.error("Error adding role:", err);
                    });
                });
            })
            .catch((err) => {
              console.error("Error fetching departments:", err);
            });
        } else if (response.menuOption === "Add an Employee") {
          let roleSelection = [];
          let managerSelection = [];

          Promise.all([managerQuery(), roleQuery()])
            .then(([managers, roles]) => {
              managers.forEach((manager) => {
                managerSelection.push(manager);
              });
              roles.forEach((role) => {
                roleSelection.push(role);
              });
              inquirer
                .prompt([
                  {
                    type: "input",
                    message: "Please enter the employee's first name:",
                    name: "firstName",
                  },
                  {
                    type: "input",
                    message: "Please enter the employee's last name:",
                    name: "lastName",
                  },
                  {
                    type: "list",
                    message:
                      "Please select the role that this employee will belong to:",
                    name: "empRole",
                    choices: roleSelection,
                  },
                  {
                    type: "list",
                    message:
                      "Please select the manager that this employee will belong to:",
                    name: "empManage",
                    choices: managerSelection,
                  },
                ])
                .then(async (response) => {
                  let selectedEmployee = `${response.firstName} ${response.lastName}`;
                  let selectedManagerId = await managerId(response.empManage);
                  let selectedRoleId = await roleId(response.empRole);
                  await addEmployee(
                    selectedEmployee,
                    selectedManagerId,
                    selectedRoleId
                  );
                  console.log(
                    `The employee ${response.firstName} ${response.lastName} has been added and under the manager of: ${response.empManage}`
                  );
                  employeeManager();
                })
                .catch((err) => {
                  console.error(`Error adding employee:`, err);
                });
            })
            .catch((err) => {
              console.error(`Error fetching roles or managers:`, err);
            });
        } else if (response.menuOption === "Update an Employee Role") {
          const employeeSelection = [];
          const roleSelection = [];

          Promise.all([employeeQuery(), roleQuery()])
            .then(([employees, roles]) => {
              employees.forEach((employee) => {
                employeeSelection.push(employee);
              });
              roles.forEach((role) => {
                roleSelection.push(role);
              });

              inquirer
                .prompt([
                  {
                    type: "list",
                    message:
                      "Please select the employee you would like to change role:",
                    name: "selectedEmployee",
                    choices: employeeSelection,
                  },
                  {
                    type: "list",
                    message:
                      "Please select the role you would like to change for this employee:",
                    name: "selectedRole",
                    choices: roleSelection,
                  },
                ])
                .then(async (response) => {
                  let selectedEmployeeId = await employeeId(
                    response.selectedEmployee
                  );
                  let selectedRoleId = await roleId(response.selectedRole);
                  await updateRole(selectedEmployeeId, selectedRoleId);

                  console.log(
                    `The employee ${response.empSelection} is now under the manager of: ${response.manSelection}`
                  );
                  employeeManager();
                })
                .catch((err) => {
                  console.error(`Error updating manager:`, err);
                });
            })
            .catch((err) => {
              console.error(`Error fetching employees or managers:`, err);
            });
        } else if (response.menuOption === "Update an Assigned Manager") {
          const employeeSelection = [];
          const managerSelection = [];

          Promise.all([employeeQuery(), managerQuery()])
            .then(([employees, managers]) => {
              employees.forEach((employee) => {
                employeeSelection.push(employee);
              });
              managers.forEach((manager) => {
                managerSelection.push(manager);
              });

              inquirer
                .prompt([
                  {
                    type: "list",
                    message:
                      "Please Select an Employee to change the manager for:",
                    name: "empSelection",
                    choices: employeeSelection,
                  },
                  {
                    type: "list",
                    message:
                      "Please Select a new manager to be assigned to this employee:",
                    name: "manSelection",
                    choices: managerSelection,
                  },
                ])
                .then(async (response) => {
                  let selectedEmployeeId = await employeeId(
                    response.empSelection
                  );
                  let selectedManagerId = await managerId(
                    response.manSelection
                  );
                  await updateManager(selectedEmployeeId, selectedManagerId);

                  console.log(
                    `The employee ${response.empSelection} is now under the manager of: ${response.manSelection}`
                  );
                  employeeManager();
                })
                .catch((err) => {
                  console.error(`Error updating manager:`, err);
                });
            })
            .catch((err) => {
              console.error(`Error fetching employees or managers:`, err);
            });
        } else if (response.menuOption === "Quit") {
          disconnect();
          console.log(
            ` <<< `.white +
              `Thank you for using the Employee Manager!`.green.bold +
              ` >>>`.white
          );
          process.exit(0);
        }
      });
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