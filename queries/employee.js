const employeeQuery = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM employee ORDER BY id', (err, result) => {
            if (err) reject(err);
            result.rows.forEach(row => {
                employeeSelection.push(`${row.first_name} ${row.last_name}`);
            });
            resolve();
        });
    });
};

module.exports = employeeQuery;