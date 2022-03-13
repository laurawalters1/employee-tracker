const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/conn");
const { viewDepartments, addDepartment } = require("./classes/department");
const { viewRoles } = require("./classes/role");
const { viewEmployees } = require("./classes/employee");
let queryResults;

const startUpOptions = [
  "View all departments",
  "View all roles",
  "View all employees",
  "Add a department",
  "Add a role",
  "Add an employee",
  "Update an employee role",
];

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
          console.log("You chose to add a role");
          startUpPrompt();
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
