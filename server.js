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
            case "Add A Role":
                addRole();
                break;
            case "View All Roles":
                viewRoles();
                break;
        }
    })
}
    // need view all department function
    // view all roles function
    function viewRoles() {
        var query = `SELECT role.id, role.title, role.salary, role.department_id
                    FROM role
                    LEFT JOIN department
                    ON department.id = role.department_id`
        connection.query(query, function (err,  res) {
            if (err) throw err;
            console.table(res);

            initalPrompt();
        })
    }
    // ========== view all employees function ==========
    function viewEmployees() {
        var query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
                     FROM employee
                     LEFT JOIN role
                     ON employee.role_id = role_id
                     LEFT JOIN department
                     ON department.id = role.department_id`
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.table(res);

            initalPrompt();
        })
    }
    // add department function
    // ========== add a role function ==========
function addRole() {
    var query = `SELECT department.id, department.name, role.salary AS budget
                FROM employee
                JOIN role
                ON employee.role_id = role.id
                JOIN department
                ON department.id = role.department_id
                GROUP BY department.id, department.name, role.salary`
connection.query(query, function (err, res){
    if (err) throw err;
const roleChoices = res.map(({ id, name }) => ({
    value: id, name: `${id} ${name}`
}));
    console.table(res);

    addRolePrompt(roleChoices);
})
}

function addRolePrompt(roleChoices) {
    inquirer
    .prompt([
        {
            type: "input",
            name: "role_title",
            message: "Enter role title"
        },
        {
            type: "input",
            name: "role_salary",
            message: "Enter role salary"
        },
        {
            type: "list",
            name: "department_id",
            message: "Select desired department",
            choices: roleChoices
        },
    ])
    .then(function (data) {
        var query = `INSERT INTO role SET ?`
    connection.query(query, 
        {
        title: data.title,
        salary: data.salary,
        department_id: data.department_id
        },
    function (err, res) {
        if (err) throw err;

        console.table(res);

        initalPrompt();
    })
    })
}
    // ========== add an employee function ============
function addEmployee() {
    var query = `SELECT role.id, role.title, role.salary
                FROM role`
    connection.query(query, function (err, res) {
        if (err) throw err;
        const roleInput = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));
        console.table(res);

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

            console.table(res);

            initalPrompt();
            }
        )
    })
}
    // updates an employee role function 
function updateEmployeeRole() {
    var query
}


initalPrompt();