USE company_db;

INSERT INTO departments (name) VALUES (
    "Customer service"),
    ("Human resources"),
   ( "Advertising"
);

INSERT INTO roles (title, salary, department_id) VALUES
("Customer agent", 10000.00, 1),
("Human resources officer", 24000.00,  2),
("Strategy manager", 50000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
("Laura", "Walters", 3, 1),
("Jane", "Doe", 1, 1),
("John", "Doe", 1, 1);
