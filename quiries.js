const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  database: process.env.DB_NAME,
});

function getDepartments() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM department ORDER BY id", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
}

function getRoles() {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT 
        role.id, 
        role.title, 
        role.salary, 
        department.name AS department 
    FROM role 
        JOIN department ON role.department_id = department.id 
    ORDER BY 
        role.id`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      }
    );
  });
}

function getEmployees() {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT 
        employee.id, employee.first_name as "first name", 
        employee.last_name as "last name", 
        role.title, department.name AS department, 
        role.salary as salary, 
    CASE WHEN 
        CONCAT(manager.first_name, ' ', manager.last_name) = ' ' 
        THEN null
        ELSE CONCAT(manager.first_name, ' ', manager.last_name) 
        END as manager 
    FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department_id = department.id 
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id 
    ORDER BY 
        employee.id`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      }
    );
  });
}

function getManagers() {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT 
            employee.id, employee.first_name as "first name", employee.last_name as "last name", role.title, department.name AS department, role.salary as salary
        FROM 
            employee 
            JOIN role ON employee.role_id = role.id 
            JOIN department ON role.department_id = department.id 
            LEFT JOIN employee AS manager ON employee.manager_id = manager.id 
        WHERE 
            employee.manager_id IS NULL 
        ORDER BY 
            employee.id`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      }
    );
  });
}

function getDepartEmployees(selectedDepartment) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT 
        employee.id, 
        employee.first_name AS "first name", 
        employee.last_name AS "last name", 
        role.title, 
        department.name AS department, 
        role.salary AS salary,
    CASE WHEN 
        CONCAT(manager.first_name, ' ', manager.last_name) = ' ' 
        THEN null 
        ELSE CONCAT(manager.first_name, ' ', manager.last_name) 
        END as manager
    FROM 
        employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department_id = department.id 
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id 
    WHERE 
        department.name = $1
    ORDER BY 
        employee.id;`,
      [selectedDepartment],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      }
    );
  });
}

function getDepartBudget(selectedDepartment) {
    return new Promise((resolve, reject) => {
        if(selectedDepartment !== "All") {
            pool.query(
                `SELECT 
                    department.name AS department,
                    COUNT(employee.id) AS "employee count",
                    SUM(role.salary) AS "total budget"
                FROM 
                    department
                    JOIN role ON department.id = role.department_id
                    LEFT JOIN employee ON role.id = employee.role_id
                WHERE
                    department.name = $1
                GROUP BY 
                    department.name;`,
                [selectedDepartment],
                (err, result) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(result.rows);
                  }
                }
            )
        } else {
            pool.query(
                `SELECT 
                  department.name AS department,
                  COUNT(employee.id) AS "employee count",
                  SUM(role.salary) AS "total budget"
              FROM 
                  department
                  JOIN role ON department.id = role.department_id
                  LEFT JOIN employee ON role.id = employee.role_id
              GROUP BY 
                department.name;`,
                (err, result) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(result.rows);
                  }
                }
            );
        }
    });
}

function addDepartment(newDepartmentName) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO department (name) VALUES ($1)",
      [newDepartmentName],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function addRole(newRolename, newRoleSal, newRoleDep) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
      [newRolename, newRoleSal, newRoleDep],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function addEmployee(selectedEmployee, selectedManagerId, selectedRoleId) {
  return new Promise((resolve, reject) => {
    const [firstName, lastName] = selectedEmployee.split(" ");
    if (selectedManagerId === -1) {
      pool.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, NULL)",
        [firstName, lastName, selectedRoleId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    } else {
      pool.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
        [firstName, lastName, selectedRoleId, selectedManagerId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    }
  });
}

function employeeQuery() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM employee ORDER BY id", (err, result) => {
      if (err) reject(err);
      result.rows.forEach((row) => {
        const employeeSelection = result.rows.map(
          (row) => `${row.first_name} ${row.last_name}`
        );
        resolve(employeeSelection);
      });
    });
  });
}

function managerQuery() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM employee ORDER BY id", (err, result) => {
      if (err) reject(err);
      result.rows.forEach((row) => {
        const managerSelection = result.rows.map(
          (row) => `${row.first_name} ${row.last_name}`
        );
        managerSelection.push("None");
        resolve(managerSelection);
      });
    });
  });
}

function roleQuery() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM role ORDER BY id", (err, result) => {
      if (err) reject(err);
      result.rows.forEach((row) => {
        const roleSelection = result.rows.map((row) => `${row.title}`);
        resolve(roleSelection);
      });
    });
  });
}

function employeeId(selectedEmployee) {
  return new Promise((resolve, reject) => {
    const [firstName, lastName] = selectedEmployee.split(" ");
    pool.query(
      `SELECT id FROM employee WHERE employee.first_name = $1 AND employee.last_name = $2`,
      [firstName, lastName],
      (err, result) => {
        if (err) reject(err);
        const employeeSelectedId = result.rows[0].id;
        resolve(employeeSelectedId);
      }
    );
  });
}

function managerId(selectedEmployee) {
  return new Promise((resolve, reject) => {
    let employeeSelectedId;
    if (selectedEmployee === "None") {
      employeeSelectedId = -1;
      resolve(employeeSelectedId);
    } else {
      const [firstName, lastName] = selectedEmployee.split(" ");
      pool.query(
        "SELECT id FROM employee WHERE first_name = $1 AND last_name = $2",
        [firstName, lastName],
        (err, result) => {
          if (err) reject(err);
          employeeSelectedId = result.rows[0].id;
          resolve(employeeSelectedId);
        }
      );
    }
  });
}

function roleId(selectedRole) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT id FROM role WHERE title = $1",
      [selectedRole],
      (err, result) => {
        if (err) reject(err);
        const roleSelectedId = result.rows[0].id;
        resolve(roleSelectedId);
      }
    );
  });
}

function updateRole(selectedEmployeeId, selectedRoleId) {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE employee SET role_id = $1 WHERE id = $2`,
      [selectedRoleId, selectedEmployeeId],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

function updateManager(selectedEmployeeId, selectedManagerId) {
  return new Promise((resolve, reject) => {
    if (selectedManagerId === -1) {
      pool.query(
        "UPDATE employee SET manager_id = NULL WHERE id = $1",
        [selectedEmployeeId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    } else if (selectedManagerId === selectedEmployeeId) {
      pool.query(
        "UPDATE employee SET manager_id = NULL WHERE id = $1",
        [selectedEmployeeId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    } else {
      pool.query(
        "UPDATE employee SET manager_id = $1 WHERE id = $2",
        [selectedManagerId, selectedEmployeeId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    }
  });
}

function disconnect() {
  pool.end();
}

module.exports = {
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
};
