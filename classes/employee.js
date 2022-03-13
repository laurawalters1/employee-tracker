employee = {
  viewEmployees: `SELECT * FROM employees`,
  addEmployee: `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?);`,
  getEmployeeNames: `SELECT first_name, last_name FROM employees;`,
  getEmployeeId: `SELECT id FROM employees WHERE first_name = ? AND last_name = ?;`,
};

module.exports = employee;
