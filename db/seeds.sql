
-- INSERT INTO department (names, id) VALUES
-- ('Sales', 1),
-- ('Engineering', 2),
-- ('Finance', 3),
-- ('Legal', 4);

INSERT INTO department (names) VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles (title, salary, department_id) VALUES
('Sales Lead', 111219.00, 1),
('Salesperson', 83560.00, 1),
('Lead Engineer', 144961.00, 2),
('Software Engineer', 115817.00, 2),
('Accountant', 98162.00, 3),
('Legal Team Lead', 210590.00, 4),
('Lawyer', 147000.00, 4);

INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, NULL),
('Kevin', 'Tupik', 4, 3),
('Malia', 'Brown', 5, NULL),
('Sarah', 'Lourd', 6, 5),
('Tom', 'Allen', 7, 5);