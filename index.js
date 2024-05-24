const inquirer = require('inquirer');

function employeeManager() {
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
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "menuOption",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role"]
    }).then((response) => {
        console.log(response);
        if(response.menuOption === "View All Departments") {
            console.log(`View All Departments`);
        }
        else if(response.menuOption === "View All Roles") {
            console.log(`View All Roles`);
        }
        else if(response.menuOption === "View All Employees") {
            console.log(`View All Employees`);
        }
        else if(response.menuOption === "Add a Department") {
            console.log(`Add a Department`);
        }
        else if(response.menuOption === "Add a Role") {
            console.log(`Add a Role`);
        }
        else if(response.menuOption === "Add a Employee") {
            console.log(`Add a Employee`);
        }
        else if(response.menuOption === "Update an Employee Role") {
            console.log(`Update an Employee Role`);
        }
    })
}

employeeManager();