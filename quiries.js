const { Pool } = require('pg');

const pool = new Pool(
    {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: 'localhost',
        database: process.env.DB_NAME
    },
);

function getDepartments() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM department', (err, result) => {
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
        pool.query('SELECT * FROM role', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
}

function getEmployees() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM employee', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
}

function employeeQuery() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM employee ORDER BY id', (err, result) => {
            if (err) reject(err);
            result.rows.forEach(row => {
                const employeeSelection = result.rows.map(row => `${row.first_name} ${row.last_name}`);
                resolve(employeeSelection);
            });
        });
    });
};

function managerQuery() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM employee ORDER BY id', (err, result) => {
            if (err) reject(err);
            result.rows.forEach(row => {
                const managerSelection = result.rows.map(row => `${row.first_name} ${row.last_name}`);
                managerSelection.push("None");
                resolve(managerSelection);
            });
        });
    });
};

function roleQuery() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM role ORDER BY id', (err, result) => {
            if (err) reject(err);
            result.rows.forEach(row => {
                const roleSelection = results.rows.map(row => `${row.title}`);
                resolve(roleSelection);
            });
        });
    });
};

function employeeId(selectedEmployee) {
    return new Promise((resolve, reject) => {
        const [firstName, lastName] = selectedEmployee.split(" ");
        pool.query(`SELECT id FROM employee WHERE employee.first_name = $1 AND employee.last_name = $2` [firstName, lastName], (err, result) => {
            if (err) reject(err);
            const employeeSelectedId = result.rows[0].id;
            resolve(employeeSelectedId);
        })
    })
}

function managerId(selectedEmployee) {
    return new Promise((resolve, reject) => {
        let employeeSelectedId;
        if (selectedEmployee === "None") {
            resolve(null);
        } else {
            const [firstName, lastName] = selectedEmployee.split(" ");
            pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', [firstName, lastName], (err, result) => {
                if (err) reject(err);
                employeeSelectedId = result.rows[0].id;
                resolve(employeeSelectedId);
            });
        }
    });
}


function roleId(selectedRole) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT id FROM role WHERE title = $1', [selectedRole], (err, result) => {
            if (err) reject(err);
            const roleSelectedId = result.rows[0].id;
            resolve(roleSelectedId);
        });
    });
}

module.exports = { employeeQuery, managerQuery, roleQuery, employeeId, managerId, roleId, getDepartments, getRoles, getEmployees };