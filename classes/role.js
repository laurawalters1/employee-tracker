role = {
  viewRoles: `SELECT * FROM roles`,
  addRole: `INSERT INTO roles (title, salary, department_id) VALUES(?, ?, ?);`,
  getRoleTitles: `SELECT title FROM roles;`,
  getRoleId: `SELECT id FROM roles WHERE title = ?;`,
};

module.exports = role;
