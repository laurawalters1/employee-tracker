department = {
  viewDepartments: `SELECT * FROM departments;`,
  addDepartment: `INSERT INTO departments (name) VALUES (?);`,
  getDepartmentNames: `SELECT name FROM departments;`,
  getDepartmentId: `SELECT id FROM departments WHERE name = ?;`,
};

module.exports = department;
