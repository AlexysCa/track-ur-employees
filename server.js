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
            "Remove An Employee",
            "Remove A Role",
            "Remove A Department",
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
            case "Update An Employee Role":
                updateEmployeeRole();
                break;
            case "View All Departments":
                viewDepartments();
                break;
            case "Add A Department":
                addDepartment();
                break;
            case "End":
                connection.end();
                break;
            case "Remove An Employee":
                removeEmployee();
                break;
            case "Remove A Role":
                removeRole();
                break;
            case "Remove A Department":
                removeDepartment();
                break;
        }
    })
}
    // ========== view all department function ========== 
    function viewDepartments() {
    console.log("Viewing all departments!");

        var query = `SELECT department.id, department.name
                    FROM department
                    LEFT JOIN role
                    ON role.department_id = department.id`
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.table(res);

            initalPrompt();
        })
    }

    // ========== view all roles function ==========
    function viewRoles() {
    console.log("Viewing all roles!");

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
    console.log("Viewing all employees!");

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
    // ========== add department function ==========
function addDepartment() {
console.log("Adding a department!");

    var query = `SELECT department.id, department.name
                FROM department
                LEFT JOIN role
                ON role.department_id = department.id`
    connection.query(query, function (err, res) {
        if (err) throw err;
    const departments = res.map(({ id, name }) => ({
        value: id, name: `${id} ${name}`
    }));
        console.table(res);

        departmentPrompt(departments)
    })
}

function departmentPrompt(departments) {
    inquirer
    .prompt ([
        {
            type: "input",
            name: "department_name",
            message: "Enter department name"
        },
    ])
    .then(function (data) {
        var query = `INSERT INTO department SET ?`
    connection.query(query,
        {
        name: data.department_name
        },
    function (err, res) {
        if (err) throw err;

        console.table(res);

        initalPrompt();
        });
    })
}

    // ========== add a role function ==========
function addRole() {
console.log("Adding a role!");

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
console.log("Adding an employee!");

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
    // ========== updates an employee role function ==========
function updateEmployeeRole() {
console.log("Updated an employee role!");

    var query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
                FROM employee
                JOIN role
                ON employee.role_id = role.id
                JOIN department
                ON department.id = role.department_id`
    connection.query(query, function (err, res){
        if (err) throw err;
        const employeeSelections = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${first_name} ${last_name}`
        }));

        console.table(res);

        allRoles(employeeSelections);
    })
}
function allRoles(employeeSelections) {
    var query = `SELECT role.id, role.title, role.salary
                FROM role`
    let roleInput;

    connection.query(query, function (err, res) {
        if (err) throw err;
    roleInput = res.map(({ id, title, salary }) => ({
       value: id, title: `${title}`, salary: `${salary}` 
    }));

        console.table(res);
        updatePrompt(employeeSelections, roleInput)
    });     
}
function updatePrompt(employeeSelections, roleInput) {
    inquirer
    .prompt([
        {
            type: "list",
            name: "employee_id",
            message: "Select which employee to update",
            choices: employeeSelections
        },
        {
            type: "list",
            name: "role_id",
            message: "Select desired role",
            choices: roleInput
        },
    ])
    .then(function (data) {
        var query = `UPDATE employee SET role_id = ? WHERE id = ?`

        connection.query(query,
            [
                data.role_id,
                data.employee_id
            ],
            function (err, res) {
                if (err) throw err;

                console.table(res);
                initalPrompt();
        });
    })
}

// ========== Removes an employee ==========
function removeEmployee() {
console.log("Removing an employee from database!");

    var query = `SELECT employee.id, employee.first_name, employee.last_name
                FROM employee`
        connection.query(query, function (err, res) {
            if (err) throw err;

            const deletingEmployee = res.map(({ id, first_name, last_name }) => ({
                value: id, name: `${id} ${first_name} ${last_name}`
            }));
        console.table(res);

        deletePrompt(deletingEmployee);

    })
}
function deletePrompt(deletingEmployee) {
    inquirer
    .prompt([
        {
            type: "list",
            name: "employee_id",
            message: "Select which employee to remove",
            choices: deletingEmployee
        }
    ])
    .then(function (data) {
    var query = `DELETE FROM employee WHERE ?`
    connection.query(query, { id: data.employee_id }, function (err, res) {
        if (err) throw err;

        console.table(res);

        initalPrompt();
    })
    })
}

// ==========  Removes a role ========== 
function removeRole() {
    console.log("Removing a role from database!");

        var query = `SELECT role.id, role.title, role.salary
                    FROM role`
            connection.query(query, function (err, res) {
                if (err) throw err;

                const deletingRole = res.map(({ id, title, salary }) => ({
                    value: id, name: `${id} ${title} ${salary}`
                }));
            console.table(res);

            deleteRolePrompt(deletingRole);

    })
}
function deleteRolePrompt(deletingRole) {
    inquirer
    .prompt([
        {
            type: "list",
            name: "role_id",
            message: "Select which role to remove",
            choices: deletingRole
        }
    ])
    .then(function (data) {
    var query = `DELETE FROM role WHERE ?`
    connection.query(query, { id: data.role_id }, function (err, res) {
        if (err) throw err;

        console.table(res);

        initalPrompt();
        })
    })
}

// ==========  Removes a department ========== 
function removeDepartment() {
    console.log("Removing a department from database!");
        var query = `SELECT department.id, department.name
                    FROM department`
            connection.query(query, function (err, res) {
                if (err) throw err;

                const deletingDepartment = res.map(({ id, name }) => ({
                   value: id, name: `${id} ${name}` 
                }));
            console.table(res);

            deleteDepartPrompt(deletingDepartment);
    })
}
function deleteDepartPrompt(deletingDepartment) {
    inquirer
    .prompt([
        {
            type: "list",
            name: "department_id",
            message: "Select which department to remove",
            choices: deletingDepartment
        }
    ])
    .then(function (data) {
        var query = `DELETE FROM department WHERE ?`
        connection.query(query, { id: data.department_id }, function (err, res) {
            if (err) throw err;

            console.table(res);

            initalPrompt();
        })
    })
}



initalPrompt();