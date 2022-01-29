const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

// creates connection with mysql
// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3001,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// inital prompts uses sees to select for next action 
function initalPrompt() {
    inquirer
    .prompt({
        type: "list",
        name: "task",
        message: "What Would You Like To Do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add A Department",
            "Add A Role",
            "Add An Employee",
            "Update An Employee Role",
            "End"]
    })
    // .then 
    // need view all department function
    // view all roles function
    // view all employees function
    // add department function
    // add a role function
    // add an employee function
    // updates an employee role function 
}
initalPrompt();