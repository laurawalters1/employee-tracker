const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/conn");
const {
  viewDepartments,
  addDepartment,
  getDepartmentNames,
  getDepartmentId,
} = require("./classes/department");
const { viewRoles, addRole } = require("./classes/role");
const { viewEmployees } = require("./classes/employee");
const { find } = require("rxjs");
let queryResults;
let depId;

const startUpOptions = [
  "View all departments",
  "View all roles",
  "View all employees",
  "Add a department",
  "Add a role",
  "Add an employee",
  "Update an employee role",
];

findDepartmentId = (departmentName) => {
  return new Promise((resolve, reject) => {
    db.query(getDepartmentId, departmentName, function (err, results) {
      if (err) {
        console.log("There was an error");
        reject();
      } else if (results) {
        console.log(results[0].id);
        depId = results[0].id;
        resolve();
      }
    });
  });
};

getDepartments = () => {
  db.query(getDepartmentNames, function (err, results) {
    if (err) {
      console.log("There was and error");
    } else {
      departmentNames = results.map((result) => result.name);
    }
    return JSON.stringify(departmentNames);
  });
};

let departmentNames = getDepartments();
console.log(departmentNames);

getDepartments();
addRolePrompt = () => {
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
        message: "Please select an option",
        choices: departmentNames,
      },
    ])
    .then((answer) => {
      findDepartmentId(answer.department).then((result) => {
        console.log(`This is the ${depId}`);
        db.query(
          addRole,
          [answer.roleName, answer.salary, depId],
          (err, results) => {
            if (err) {
              console.log("There was an error adding this role name" + err);
            } else {
              console.log("role added!");
            }
            startUpPrompt();
          }
        );
      });
    });
};

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
          db.query(viewRoles, function (err, results) {
            console.table(results);
            startUpPrompt();
          });

          break;
        case "View all employees":
          db.query(viewEmployees, function (err, results) {
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
          console.log("You chose to add an employee");
          startUpPrompt();
          break;
        case "Update an employee role":
          console.log("You chose to update an employee role");
          startUpPrompt();
          break;
        default:
        // code block
      }
    });
};

startUpPrompt();
