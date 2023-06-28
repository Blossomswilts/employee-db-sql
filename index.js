const mysql = require("mysql2");
const inquirer = require("inquirer");
//___________________________Connection to mySQL / Inquirer________________________________________________________
//mySQL connection
const db = mysql
  .createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_db",
  })
  .promise();
// Inquirer prompts for the start menu.
const start = async () => {
  const answer = await inquirer.prompt({
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
  });
  switch (answer.action) {
    case "View all departments":
      await viewDepartments();
      break;
    case "View all roles":
      await viewRoles();
      break;
    case "View all employees":
      await viewEmployees();
      break;
    case "Add a department":
      await addDepartment();
      break;
    case "Add a role":
      await addRole();
      break;
    case "Add an employee":
      await addEmployee();
      break;
    case "Update employee":
      await updateEmployeeRole();
      break;
    case "Delete a role":
      await deleteRole();
      break;
    case "Delete a department":
      await deleteDepartment();
      break;
    case "Delete an employee":
      await deleteEmployee();
      break;
    case "Exit":
      db.end();
      break;
  }
};

//___________________________Functions for each of the start menu choices.________________________________________________________
//View all departments
const viewDepartments = async () => {
  const viewDep = await db.query("SELECT * FROM department");
  console.table(viewDep[0]);
  start();
};
//View all roles
const viewRoles = async () => {
  const roleArray = await db.query("SELECT * FROM roles");
  console.table(roleArray[0]);
  start();
};
//View all employees
const viewEmployees = async () => {
  const employeeArray = await db.query("SELECT * FROM employee");
  console.table(employeeArray[0]);
  start();
};
//Add a department
const addDepartment = async () => {
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
const addRole = async () => {
  const answer = await inquirer.prompt([
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
  ]);
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
};
//Add an employee
const addEmployee = async () => {
  const roleArray = await roleChoices();
  const answer = await inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "What is the first name of the employee you would like to add?",
    },
    {
      name: "last_name",
      type: "input",
      message: "What is the last name of the employee you would like to add?",
    },
    {
      name: "roles_title",
      type: "list",
      choices: roleArray,
      message: "Which role is the employee being added to?",
    },
    {
      name: "manager_id",
      type: "input",
      message:
        "Who is the manager of the employee you would like to add, if any? Add by ID.",
    },
  ]);
  db.query(
    "INSERT INTO employee SET ?",
    {
      first_name: answer.first_name,
      last_name: answer.last_name,
      roles_id: answer.roles_title,
      manager_id: answer.manager_id,
    },
    (err, results) => {
      if (err) throw err;
      console.log("Employee added.");
    }
  );
    start();
};
//Update an employee role
const updateEmployeeRole = async () => {
  const roleArray = await roleChoices();
  const answer = await inquirer.prompt([
    {
      name: "employee_id",
      type: "input",
      message: "What is the id of the employee you would like to update?",
    },
    {
      name: "roles_id",
      type: "list",
      message: "What role would you like to update the employee to?",
      choices: roleArray,
    },
  ]);
  db.query(
    "UPDATE employee SET roles_id = ? WHERE id = ?",
    [answer.roles_id, answer.employee_id],
    (err, results) => {
      if (err) throw err;
      console.log("Employee updated.");
      start();
    }
  );
};

//Delete a role
const deleteRole = async () => {
  const roleArray = await roleChoices();
  const answer = await inquirer.prompt({
    name: "role_id",
    type: "list",
    message: "Which role would you like to delete?",
    choices: roleArray,
  });
  db.query(
    "DELETE FROM roles WHERE id = ?",
    [answer.role_id],
    (err, results) => {
      if (err) throw err;
      console.log("Role deleted.");
      start();
    }
  );
};
//Delete a department
const deleteDepartment = async () => {
  const departmentArray = await departmentChoices();
  const answer = await inquirer.prompt({
    name: "department_id",
    type: "list",
    message: "Which department would you like to delete?",
    choices: departmentArray,
  });
  db.query(
    "DELETE FROM department WHERE id = ?",
    [answer.department_id],
    (err, results) => {
      if (err) throw err;
      console.log("Department deleted.");
      start();
    }
  );
};
//Delete an employee
const deleteEmployee = async () => {
  const answer = await inquirer.prompt({
    name: "employee_id",
    type: "input",
    message: "Please enter the id of the employee you would like to delete.",
  });
  db.query(
    "DELETE FROM employee WHERE id = ?",
    [answer.employee_id],
    (err, results) => {
      if (err) throw err;
      console.log("Employee deleted.");
      start();
    }
  );
};

//____________________________________Functions____________________________________________
//Brings a list of choices for roles
const roleChoices = async () => {
  return (await db.query("SELECT id AS value, title AS name FROM roles"))[0];
};

//Brings a list of choices for departments
const departmentChoices = async () => {
  return (
    await db.query("SELECT id AS value, names AS name FROM department")
  )[0];
};
start();
