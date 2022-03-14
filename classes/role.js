role = {
  viewRoles: `SELECT * FROM roles`,
  addRole: `INSERT INTO roles (title, salary, department_id) VALUES(?, ?, ?);`,
  getRoleTitles: `SELECT title FROM roles;`,
  getRoleId: `SELECT id FROM roles WHERE title = ?;`,
  viewRolesJoin: `SELECT *
  FROM roles
  JOIN departments ON roles.department_id = departments.id;`,
};

module.exports = role;
