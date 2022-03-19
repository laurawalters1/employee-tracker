// Pulling in dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/conn");
// Destructuring query statements from object files
const {
  viewDepartments,
  addDepartment,
  getDepartmentNames,
  getDepartmentId,
} = require("./classes/department");
const {
  viewRoles,
  addRole,
  getRoleTitles,
  getRoleId,
  viewRolesJoin,
} = require("./classes/role");
const {
  viewEmployees,
  addEmployee,
  getEmployeeNames,
  getEmployeeId,
  viewEmployeeJoin,
  updateEmployee,
} = require("./classes/employee");
const { find } = require("rxjs");
let queryResults;
// Setting up variables to be used throughout the application
let depId;
let roleId;
let employeeId;
let departmentNames;
let roleTitles;
let employeeNames;

// Setting up the array for the start up menu
const startUpOptions = [
  "View all departments",
  "View all roles",
  "View all employees",
  "Add a department",
  "Add a role",
  "Add an employee",
  "Update an employee role",
];

// Function which runs the database query and and sets the employeeId variable to that of the chosen manager
findEmployeeId = (employeeFirstName, employeeLastName) => {
  return new Promise((resolve, reject) => {
    db.query(
      getEmployeeId,
      [employeeFirstName, employeeLastName],
      function (err, results) {
        if (err) {
          console.log("There was an error finding the employees");
          reject();
        } else if (results) {
          //   console.log(`Employee id: ${results[0].id}`);
          employeeId = results[0].id;
          resolve();
        }
      }
    );
  });
};

// Function the get the role id of the employee currently being accessed
findRoleId = (roleTitle) => {
  return new Promise((resolve, reject) => {
    db.query(getRoleId, roleTitle, function (err, results) {
      if (err) {
        console.log("There was an error finding the roles");
        reject();
      } else if (results) {
        roleId = results[0].id;
        resolve();
      }
    });
  });
};

// Function to get the department id of the department currently being accessed
findDepartmentId = (departmentName) => {
  return new Promise((resolve, reject) => {
    db.query(getDepartmentId, departmentName, function (err, results) {
      if (err) {
        console.log("There was an error finding the departments");
        reject();
      } else if (results) {
        console.log(results[0].id);
        depId = results[0].id;
        resolve();
      }
    });
  });
};

// Function to get the departments array to display as a menu for the user
getDepartments = () => {
  return new Promise((resolve, reject) => {
    db.query(getDepartmentNames, function (err, results) {
      if (err) {
        console.log("There was and error generating the departments list");
        reject();
      } else {
        departmentNamesArr = results.map((result) => result.name);
      }
      departmentNames = JSON.stringify(departmentNamesArr);
      resolve();
      return JSON.stringify(departmentNamesArr);
    });
  });
};

// Function to get the roles array to display as a menu to the user
getRoles = () => {
  return new Promise((resolve, reject) => {
    db.query(getRoleTitles, function (err, results) {
      if (err) {
        console.log("There was an error getting the role titles");
        reject();
      } else {
        roleTitlesArr = results.map((result) => result.title);
      }
      roleTitles = JSON.stringify(roleTitlesArr);
      resolve();
      return JSON.stringify(roleTitlesArr);
    });
  });
};

// Function to get employees array to display as a menu to the user
getEmployees = () => {
  return new Promise((resolve, reject) => {
    db.query(getEmployeeNames, function (err, results) {
      if (err) {
        console.log("There was and error getting ");
        reject();
      } else {
        employeeNamesArr = results.map(
          (result) => result.first_name + " " + result.last_name
        );
      }
      employeeNames = JSON.stringify(employeeNamesArr);
      resolve();
      return JSON.stringify(employeeNamesArr);
    });
  });
};

getDepartments();
getEmployees();
getRoles();

// Prompt to add an employee
addEmployeePrompt = () => {
  Promise.all([getRoles(), getEmployees()]).then((results) => {
    getEmployees().then((results) => {
      inquirer
        .prompt([
          {
            name: "firstName",
            message: "Please provide this employees first name",
          },
          {
            name: "secondName",
            message: "Please provide this employees second name",
          },
          {
            type: "list",
            name: "role",
            message: "Please select this employees role",
            choices: JSON.parse(roleTitles),
          },
          {
            type: "list",
            name: "manager",
            message: "Please select this employees manager",
            choices: JSON.parse(employeeNames),
          },
        ])
        .then((answer) => {
          let managerName = answer.manager;
          // Converting manager name answer into a format which can be submitted into the findEmployeeId function
          let managerNameArr = managerName.split(" ");

          Promise.all([
            findRoleId(answer.role),

            findEmployeeId(managerNameArr[0], managerNameArr[1]),
          ])
            .then((result) => {
              db.query(
                addEmployee,
                [answer.firstName, answer.secondName, roleId, employeeId],
                (err, results) => {
                  if (err) {
                    console.log("There was an error adding this employee name");
                  } else {
                    console.log("employee added!");
                  }
                  startUpPrompt();
                }
              );
            })
            .catch((exc, err) => {
              console.log(`There was an error adding this employee name`);
            });
        });
    });
  });
};
// Prompt to add a new role
addRolePrompt = () => {
  getDepartments().then((results) => {
    inquirer
      .prompt([
        {
          name: "roleName",
          message: "Please provide the role name",
        },
        {
          name: "salary",
          message: "Please provide this roles salary",
        },
        {
          type: "list",
          name: "department",
          message: "Please select an the department to which this role belongs",
          choices: JSON.parse(departmentNames),
        },
      ])
      .then((answer) => {
        findDepartmentId(answer.department).then((result) => {
          db.query(
            addRole,
            [answer.roleName, answer.salary, depId],
            (err, results) => {
              if (err) {
                console.log("There was an error adding this role name");
              } else {
                console.log("role added!");
              }
              startUpPrompt();
            }
          );
        });
      });
  });
};

// Prompt to add a department
addDepartmentPrompt = () => {
  inquirer
    .prompt([
      {
        name: "departmentName",
        message: "Please provide the department name",
      },
    ])
    .then((answer) => {
      db.query(addDepartment, answer.departmentName, (err, results) => {
        if (err) {
          console.log("There was an error adding this department name");
        } else {
          console.log("Department added!");
        }
        startUpPrompt();
      });
    });
};

// Prompt to update an employee
updateEmployeePrompt = () => {
  getEmployees().then((results) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Please choose an employee to update",
          choices: JSON.parse(employeeNames),
        },
        {
          type: "list",
          name: "role",
          message:
            "Please select which role you would like to update this employee to",
          choices: JSON.parse(roleTitles),
        },
      ])
      .then((answer) => {
        findRoleId(answer.role).then(() => {
          let employeeName = answer.employee;
          let employeeNameArr = employeeName.split(" ");
          findEmployeeId(employeeNameArr[0], employeeNameArr[1]).then(() => {
            db.query(updateEmployee, [roleId, employeeId], (err, results) => {
              if (err) {
                console.log("There was an error updating this employee");
                // console.log(updateEmployee);
              } else {
                console.log("Employee updated!");
                startUpPrompt();
              }
            });
          });
        });
      });
  });
};

startUpPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Please select an option",
        choices: startUpOptions,
      },
    ])
    .then((answer) => {
      switch (answer.options) {
        case "View all departments":
          db.query(viewDepartments, function (err, results) {
            console.table(results);
            startUpPrompt();
          });

          break;
        case "View all roles":
          db.query(viewRolesJoin, function (err, results) {
            console.table(results);
            startUpPrompt();
          });

          break;
        case "View all employees":
          db.query(viewEmployeeJoin, function (err, results) {
            console.table(results);
            startUpPrompt();
          });

          break;
        case "Add a department":
          addDepartmentPrompt();

          break;
        case "Add a role":
          addRolePrompt();
          break;
        case "Add an employee":
          addEmployeePrompt();
          break;
        case "Update an employee role":
          updateEmployeePrompt();

          break;
        default:
      }
    });
};

// Implementation of the application
startUpPrompt();
