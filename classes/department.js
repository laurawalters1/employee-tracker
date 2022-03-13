department = {
  viewDepartments: `SELECT * FROM departments`,
  addDepartment: `INSERT INTO departments (name) VALUES ("?");`,
};

module.exports = department;
