const mysql = require("mysql2");
const inquirer = require("inquirer");
const { type } = require("express/lib/response");
require("console.table");

// creates connection with mysql
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'favcookie',
    database: 'employees_db'
});

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
    .then(function ({ task }) {
        switch (task) {
            case "Add An Employee":
                addEmployee();
                break;
            case "View All Employees":
                viewEmployees();
                break;
        }
    })
}
    // need view all department function
    // view all roles function
    // view all employees function
    function viewEmployees() {
        var query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
                     FROM employee
                     LEFT JOIN role
                     ON employee.role_id = role_id
                     LEFT JOIN department
                     ON department.id = role.department_id`
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.log(res);

            initalPrompt();
        })
    }
    // add department function
    // add a role function
    // ========== add an employee function ============
function addEmployee() {
    var query = `SELECT role.id, role.title, role.salary
                FROM role`
    connection.query(query, function (err, res) {
        if (err) throw err;
        const roleInput = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));
        console.log(res);

        insertPrompt(roleInput);
    })
}
    
function insertPrompt(roleInput) {
    inquirer
    .prompt([
    {
        type: "input",
        name: "first_name",
        message: "Enter the employee's first name."
    },
    {
        type: "input",
        name: "last_name",
        message: "Enter the employee's last name."
    },
    {
        type: "list",
        name: "role_id",
        message: "Select employee's role.",
        choices: roleInput
    },
    ])
    .then(function (data) {
        console.log(data);

    var query = `INSERT INTO employee SET ?`
    connection.query(query,
        {
            first_name: data.first_name,
            last_name: data.last_name,
            role_id: data.role_id,
        },
        function (err, res) {
            if (err) throw err;

            console.log(res);

            initalPrompt();
            }
        )
    })
}
    // updates an employee role function 


initalPrompt();