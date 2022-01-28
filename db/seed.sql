USE employees_db;

/* entering data into DEPARTMENT table */
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Marketing");
INSERT INTO department (name)
VALUES ("Customer Relations");

/* entering data into ROLE table */
INSERT INTO role (title, salary, department_id)
VALUES
("Head of Financing", 250000, 1);
("Sales Lead", 200000, 2);
("Marketing Director", 250000, 3);
("Supervisor", 200000, 4);

/* entering data into EMPLOYEE table*/
INSERT INTO employees_db (first_name, last_name, role_id, manager_id)
VALUES
("Jim", "Harp", 2, null);
("Angela", "Bap", 1, null);
("Alexys" "Carrasquillo", 3, null);
("James", "Whit", 4, null);