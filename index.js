const mysql = require("mysql2");
const inquirer = require("inquirer");
//___________________________Connection to mySQL / Inquirer________________________________________________________
//mySQL connection
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  start();
});
// Inquirer prompts for the start menu.
const start = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update employee",
        "Delete a role",
        "Delete a department",
        "Delete an employee",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update employee":
          updateEmployeeRole();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Exit":
          db.end();
          break;
      }
    });
};

//___________________________Functions for each of the start menu choices.________________________________________________________
//View all departments
const viewDepartments = () => {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
};
//View all roles
const viewRoles = () => {
  db.query("SELECT * FROM roles", (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
};
//View all employees
const viewEmployees = () => {
  db.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
};
//Add a department
const addDepartment = () => {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the name of the department you would like to add?",
    })
    .then((answer) => {
      db.query(
        "INSERT INTO department SET ?",
        { names: answer.department },
        (err, results) => {
          if (err) throw err;
          console.log("Department added.");
          start();
        }
      );
    });
};
//Add a role
const addRole = () => {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the role you would like to add?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of the role you would like to add?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false || "Please enter a valid salary.";
        },
      },
      {
        name: "department_id",
        type: "input",
        message: "What is the department id of the role you would like to add?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false || "Please enter a valid ID.";
        },
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO roles SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        (err, results) => {
          if (err) throw err;
          console.log("Roles added.");
          start();
        }
      );
    });
};
//Add an employee
const addEmployee = () => {
  roleChoices();
  
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message:
          "What is the first name of the employee you would like to add?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the last name of the employee you would like to add?",
      },
      {
        name: "role_id",
        // Choices can be a list taken from properties
        // Try map() id/name to name/value
        //Supply array for choices of roles
        type: "list",
        choices: roleChoices,
        message: "What is the role id of the employee you would like to add?",
      },
      {
        name: "manager_id",
        type: "input",
        message:
          "Who is the manager of the employee you would like to add, if any?",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          roles_id: answer.roles_id,
          manager_id: answer.manager_id,
        },
        (err, results) => {
          if (err) throw err;
          console.log("Employee added.");
          start();
        }
      );
    });
};
//Update an employee role
const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        name: "employee_id",
        type: "input",
        message: "What is the id of the employee you would like to update?",
      },
      {
        name: "roles_id",
        type: "input",
        message:
          "What is the new role id of the employee you would like to update?",
      },
    ])
    .then((answer) => {
      db.query(
        "UPDATE employee SET roles_id = ? WHERE id = ?",
        [answer.roles_id, answer.employee_id],
        (err, results) => {
          if (err) throw err;
          console.log("Employee updated.");
          start();
        }
      );
    });
};

//Delete a role
const deleteRole = () => {
  inquirer
    .prompt({
      name: "role_id",
      type: "input",
      message: "What is the id of the role you would like to delete?",
    })
    .then((answer) => {
      db.query(
        "DELETE FROM roles WHERE id = ?",
        [answer.role_id],
        (err, results) => {
          if (err) throw err;
          console.log("Role deleted.");
          start();
        }
      );
    });
};
//Delete a department
const deleteDepartment = () => {
  inquirer
    .prompt({
      name: "department_id",
      type: "input",
      message: "What is the id of the department you would like to delete?",
    })
    .then((answer) => {
      db.query(
        "DELETE FROM department WHERE id = ?",
        [answer.department_id],
        (err, results) => {
          if (err) throw err;
          console.log("Department deleted.");
          start();
        }
      );
    });
};
//Delete an employee
const deleteEmployee = () => {
  inquirer
    .prompt({
      name: "employee_id",
      type: "input",
      message: "What is the id of the employee you would like to delete?",
    })
    .then((answer) => {
      db.query(
        "DELETE FROM employee WHERE id = ?",
        [answer.employee_id],
        (err, results) => {
          if (err) throw err;
          console.log("Employee deleted.");
          start();
        }
      );
    });
};

//____________________________________Functions____________________________________________
//Create object of an array of choices for roles
const roleChoices = () => {
  db.query("SELECT * FROM roles", (err, results) => {
    if (err) throw err;
    const roleArray = results.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    return roleArray;
  });
}
//Create object of an array of choices for managers
const managerChoices = () => {
  db.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    const managerArray = results.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    return managerArray;
  });
}
//Create object of an array of choices for departments
const departmentChoices = () => {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    const departmentArray = results.map(({ id, name }) => ({
      name: name,
      value: id,
    }));
    return departmentArray;
  });
}