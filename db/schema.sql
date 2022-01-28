DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db; 

USE employees_db;

/* creates table for DEPARTMENT */
CREATE TABLE department (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
    /* varchar(30) is the character limit and holds department name */
    name VARCHAR(30)
);

/* creates table for ROLE */
CREATE TABLE role (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    /* holds role title*/
    title VARCHAR(30),
    /* holds the salary*/
    salary DECIMAL NULL,
    /* holds reference to the department name is belongs to*/
    department_id INT NULL
);

/* creates table for EMPLOYEE */
CREATE TABLE employee (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    /* holds first name*/
    first_name VARCHAR(30),
    /* holds last name*/
    last_name VARCHAR(30),
    /* holds reference to employee role*/
    role_id INT NULL,
    /* holds reference to manager of current employee*/
    manager_id INT NULL
);