const mysql = require('mysql2');
const inquirer = require('inquirer');
//___________________________Connection to mySQL / Inquirer________________________________________________________
//mySQL connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'employee_db'
    });

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    start();
}
);
// Inquirer prompts for the start menu. 
const start = () => {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee', 'Exit']
    })
        .then(answer => {
            switch (answer.action) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update employee':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    db.end();
                    break;
            }
        })
}

//___________________________Functions for each of the start menu choices.________________________________________________________
//View all departments
const viewDepartments = () => {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    })
}
//View all roles
const viewRoles = () => {
    db.query('SELECT * FROM role', (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    })
}
//View all employees
const viewEmployees = () => {
    db.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    })
}
//Add a department
const addDepartment = () => {
    inquirer.prompt({
        name: 'department',
        type: 'input',
        message: 'What is the name of the department you would like to add?'
    })
        .then(answer => {
            db.query('INSERT INTO department SET ?', { name: answer.department }, (err, results) => {
                if (err) throw err;
                console.log('Department added.');
                start();
            })
        })
}
//Add a role
const addRole = () => {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the title of the role you would like to add?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role you would like to add?'
        },
        {
            name: 'department_id',
            type: 'input',
            message: 'What is the department id of the role you would like to add?'
        }
    ])
        .then(answer => {
            db.query('INSERT INTO role SET ?', { title: answer.title, salary: answer.salary, department_id: answer.department_id }, (err, results) => {
                if (err) throw err;
                console.log('Role added.');
                start();
            })
        })
}
//Add an employee
const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'What is the first name of the employee you would like to add?'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'What is the last name of the employee you would like to add?'
        },
        {
            name: 'role_id',
            type: 'input',
            message: 'What is the role id of the employee you would like to add?'
        },
        {
            name: 'manager_id',
            type: 'input',
            message: 'What is the manager id of the employee you would like to add?'
        }
    ])
        .then(answer => {
            db.query('INSERT INTO employee SET ?', { first_name: answer.first_name, last_name: answer.last_name, role_id: answer.role_id, manager_id: answer.manager_id }, (err, results) => {
                if (err) throw err;
                console.log('Employee added.');
                start();
            })
        })
}
//Update an employee role
const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            name: 'employee_id',
            type: 'input',
            message: 'What is the id of the employee you would like to update?'
        },
        {
            name: 'role_id',
            type: 'input',
            message: 'What is the new role id of the employee you would like to update?'
        }
    ])
        .then(answer => {
            db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.role_id, answer.employee_id], (err, results) => {
                if (err) throw err;
                console.log('Employee updated.');
                start();
            })
        })
}







