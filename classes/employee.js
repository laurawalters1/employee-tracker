employee = {
  viewEmployees: `SELECT * FROM employees`,
  addEmployee: `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?);`,
  getEmployeeNames: `SELECT first_name, last_name FROM employees;`,
  getEmployeeId: `SELECT id FROM employees WHERE first_name = ? AND last_name = ?;`,
  viewEmployeeJoin: `SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, departments.name, manager.first_name as manager_first_name, manager.last_name as manager_last_name
  FROM employees employee
  INNER JOIN roles ON employee.role_id = roles.id
  INNER JOIN departments ON roles.department_id = departments.id
  INNER JOIN employees manager ON employee.manager_id = manager.id;`,
};

module.exports = employee;
