const roleQuery = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM role ORDER BY id', (err, result) => {
            if (err) reject(err);
            result.rows.forEach(row => {
                roleSelection.push(row.title);
            });
            resolve();
        });
    });
};

module.exports = roleQuery;