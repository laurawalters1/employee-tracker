role = {
  viewRoles: `SELECT * FROM roles`,
  addRole: `INSERT INTO roles (title, salary, department_id) VALUES(?, ?, ?);`,
};

module.exports = role;
